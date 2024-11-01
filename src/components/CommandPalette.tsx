import React, { useState, useEffect, useRef } from 'react';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';


interface CommandItem {
  name: string;
  description: string;
  shortcut?: string;
  href?: string;
  action?: () => void;
}

interface Props {
  commands: CommandItem[];
}

function limitString(str: string, limit: number) {
  return str.length > limit ? str.slice(0, limit) + '...' : str;
}

export function CommandPalette({ commands }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<CommandItem[]>(commands);
  const [pagefindResults, setPagefindResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const pagefindRef = useRef<any>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    const loadPagefind = async () => {
      if (typeof window !== 'undefined') {
        const pagefind = await import('../../dist/pagefind/pagefind.js');
        pagefindRef.current = pagefind;
      }
    };

    loadPagefind();
  }, []);

  useEffect(() => {
    const searchCommands = async () => {
      if (search) {
        const commandResults = commands.filter((command) =>
          command.name.toLowerCase().includes(search.toLowerCase())
        );

        setResults(commandResults);
        if (pagefindRef.current) { //commandResults.length === 0
          const searchResult = await pagefindRef.current.search(search);
          await Promise.all(searchResult.results.map(async (result: any) => {
            result.loaded_data = await result.data();
          }));
          // console.log(searchResult.results[0].loaded_data);
          setPagefindResults(searchResult.results);
        } else {
          setPagefindResults([]);
        }
      } else {
        setResults(commands);
        setPagefindResults([]);
      }
      setSelectedIndex(0);
    };

    searchCommands();
  }, [search, commands]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prevIndex) => 
        (prevIndex + 1) % (results.length + pagefindResults.length)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prevIndex) => 
        (prevIndex - 1 + results.length + pagefindResults.length) % (results.length + pagefindResults.length)
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selectedItem = [...results, ...pagefindResults][selectedIndex];
      if (selectedItem) {
        if (selectedItem.action) {
          selectedItem.action();
        } else if (selectedItem.href) {
          window.location.href = selectedItem.href;
        } else if (selectedItem.loaded_data?.url) {
          window.location.href = selectedItem.loaded_data.url.replace('/public/', '');
        }
      }
    }
  };

  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 p-2 bg-white rounded-md"
      >
        <Search className="w-5 h-5" color="black"/>
        <span className="sr-only">Open command palette</span>
      </button>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command palette"
        className="fixed inset-0 z-50 bg-black/50"
      >
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Command 
            className="w-full max-w-2xl rounded-lg bg-white shadow-lg"
            onKeyDown={handleKeyDown}
            filter={((value, search) => {
              if (value.toLowerCase().includes(search.toLowerCase())) {
                return 1;
              } else {
                return 0;
              }
            })}
            loop
          >
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="w-full px-4 py-2 text-lg border-b border-gray-200 focus:outline-none rounded-lg"
            />
            <Command.List className="max-h-[300px] overflow-y-auto p-2" ref={listRef}>
              <Command.Empty className="py-2 text-center text-gray-500">
                No results found.
              </Command.Empty>
              <Command.Group>
              {/* <AnimatePresence> */}
              {results.map((command, index) => (
                <Command.Item
                key={'command-' + command.name}
                value={command.name}
                onSelect={() => {
                  console.log(`Selected command: ${command.name}`);
                  setOpen(false);
                }}
                className={`flex flex-col px-2 py-1 rounded cursor-pointer ${
                  index === selectedIndex ? 'bg-blue-100' : 'hover:bg-gray-100'
                } transition-all duration-200 ease-in-out`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{command.name}</span>
                  {command.shortcut && (
                    <span className="text-sm text-gray-500">{command.shortcut}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{command.description}</p>
              </Command.Item>
              ))}
              {/* </Command.List> */}
              {/* <Command.List className="max-h-[300px] overflow-y-auto p-2" ref={listRef}> */}
              {/* {[1, 2, 3].map((n) => (<h1>{n}</h1>))} */}
              </Command.Group>
              <Command.Group heading={pagefindResults.length > 0 ? "search results" : ""}>
              {pagefindResults.map((result, index) => {return (
                // <motion.div
                  // key={result.id}
                  // initial={{ opacity: 0, y: -10 }}
                  // animate={{ opacity: 1, y: 0 }}
                  // exit={{ opacity: 0, y: 10 }}
                  // transition={{ duration: 0.2 }}
                // >
                  <Command.Item
                    key={'pagefind-' + result.id}
                    value={result.loaded_data.content}
                    onSelect={() => {
                      window.location.href = result.loaded_data.url;
                      setOpen(false);
                    }}
                    className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer ${
                      index + results.length === selectedIndex ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium">{result.loaded_data.meta.title}</span>
                    <span className="text-sm text-gray-500">{result.loaded_data.url}</span>
                    {/* {console.log(result.loaded_data.meta.title)} */}
                    <div className='flex flex-col'>
                      {result.loaded_data.sub_results.map((sub_result: any, index: number) => (
                        <p className="text-sm text-gray-600 mt-1" dangerouslySetInnerHTML={{__html: limitString(sub_result.excerpt, 50)}}></p>  
                      ))}
                    </div>

                    {/* <span>{result.loaded_data.meta.title}</span>
                    <p className="text-sm text-gray-500" dangerouslySetInnerHTML={{__html: result.loaded_data.excerpt}}></p>
                    <span className="text-sm text-gray-500">{result.loaded_data.url}</span> */}
                  </Command.Item>
                // </motion.div>
              )})}
              </Command.Group>
              {/* </AnimatePresence> */}
            </Command.List>
          </Command>
        </div>
      </Command.Dialog>
    </>
  );
}