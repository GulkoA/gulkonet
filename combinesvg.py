from svgpathtools import svg2paths, Path, Line, CubicBezier
import numpy as np

def load_svg(svg_file):
    """Load paths from an SVG file."""
    paths, _ = svg2paths(svg_file)
    return paths

def path_length(path):
    """Calculate the total length of a path."""
    return sum(segment.length() for segment in path)

def find_largest_path(paths):
    """Find the largest path based on total length."""
    return max(paths, key=path_length)

def find_closest_point(path1, path2):
    """Find the closest points between two paths."""
    end1, start1 = path1[-1].end, path1[0].start
    end2, start2 = path2[-1].end, path2[0].start

    # Compute distances between possible connection points
    distances = [
        (np.abs(end1 - start2), end1, start2),
        (np.abs(end1 - end2), end1, end2),
        (np.abs(start1 - start2), start1, start2),
        (np.abs(start1 - end2), start1, end2),
    ]

    # Find the minimum distance pair
    min_dist, point1, point2 = min(distances, key=lambda x: x[0])
    return min_dist, point1, point2

def connect_path(major_path, minor_path, threshold=10.0):
    """Connect a minor path to the major path if within the threshold."""
    min_dist, point1, point2 = find_closest_point(major_path, minor_path)

    if min_dist <= threshold:  # Only connect if close enough
        connecting_line = Line(point1, point2)
        major_path.append(connecting_line)
        major_path.extend(minor_path)
    return major_path

def filter_and_connect_paths(paths, threshold=10.0, min_length=50.0):
    """Filter small paths and connect the relevant ones to the largest path."""
    # Identify the largest path
    largest_path = find_largest_path(paths)
    remaining_paths = [p for p in paths if p != largest_path]

    # Filter out paths that are too short
    filtered_paths = [p for p in remaining_paths if path_length(p) > min_length]

    # Connect the relevant floating paths to the largest path
    for path in filtered_paths:
        largest_path = connect_path(largest_path, path, threshold)

    return largest_path

def smooth_path(path, smoothing_factor=0.2):
    """Apply cubic Bezier smoothing to reduce sharp edges in the path."""
    smoothed_path = Path()

    for i in range(len(path) - 1):
        # Generate a smooth cubic Bezier curve between consecutive points
        p0 = path[i].end
        p1 = p0 + (path[i + 1].start - p0) * smoothing_factor
        p2 = path[i + 1].start - (path[i + 1].start - p0) * smoothing_factor
        p3 = path[i + 1].start

        bezier = CubicBezier(p0, p1, p2, p3)
        smoothed_path.append(bezier)

    return smoothed_path

def save_svg(output_file, continuous_path):
    """Save the final path as an SVG."""
    from svgwrite import Drawing
    dwg = Drawing(output_file)
    path_string = continuous_path.d()  # Convert to SVG path string
    dwg.add(dwg.path(d=path_string, fill="none", stroke="black"))
    dwg.save()

# Usage example:
input_svg = "C:/Users/alexg/Desktop/Best_3_no_bg_edge.svg"
output_svg = "./output.svg"

# Load and process paths
paths = load_svg(input_svg)
connected_path = filter_and_connect_paths(paths, threshold=10.0, min_length=50.0)

# Optionally smooth the path
smoothed_path = smooth_path(connected_path)

# Save the result
save_svg(output_svg, smoothed_path)
