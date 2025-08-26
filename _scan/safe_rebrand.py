#!/usr/bin/env python3
import os
import re
import csv
import difflib
from pathlib import Path

def is_allowed_path_and_extension(file_path):
    """Check if file is in allowed scope: components/**, app/**, pages/** with .tsx/.jsx/.mdx/.md"""
    
    # Allowed path patterns
    allowed_paths = [r'components/', r'app/', r'pages/']
    
    # Allowed extensions
    allowed_extensions = ['.tsx', '.jsx', '.mdx', '.md']
    
    # Check path
    path_allowed = any(re.search(pattern, file_path) for pattern in allowed_paths)
    
    # Check extension
    ext_allowed = any(file_path.endswith(ext) for ext in allowed_extensions)
    
    return path_allowed and ext_allowed

def is_dangerous_line(line_content):
    """Check if line contains dangerous patterns that should not be modified"""
    
    dangerous_patterns = [
        r'(http|https)://',     # URLs
        r'@.*\.(com|io|net|org)',  # Email addresses  
        r'\.(com|io|net|org)',     # Domain references
        r'_ID\b', r'_KEY\b', r'_SECRET\b',  # Environment variables
        r'\bcookie\b', r'\blocalStorage\b', # Storage references
        r'\bcallback\b', r'\bproviderId\b', r'\bwebhook\b',  # API integrations
        r'uploadPreset',        # Cloudinary integration
        r'"name":\s*"',         # Package.json name field
        r'href\s*=\s*"https?', # URL links
        r'process\.env\.',      # Environment variable references
    ]
    
    for pattern in dangerous_patterns:
        if re.search(pattern, line_content, re.I):
            return True
    
    return False

def apply_case_preserving_replacement(text, old_token, new_token):
    """Apply case-preserving replacement: neuvisia->zinvero, Neuvisia->Zinvero, NEUVISIA->ZINVERO"""
    
    def replace_func(match):
        original = match.group(0)
        if original.islower():
            return new_token.lower()
        elif original.istitle():
            return new_token.capitalize()
        elif original.isupper():
            return new_token.upper()
        else:
            # Mixed case, preserve original casing pattern
            return new_token
    
    pattern = re.compile(re.escape(old_token), re.I)
    return pattern.sub(replace_func, text)

def main():
    root = "/Users/vladi/Documents/Projects/webapps/Zinvero"
    report_file = os.path.join(root, "_scan", "brand_tokens_report.txt")
    safe_changes_file = os.path.join(root, "_scan", "safe_ui_changes.csv")
    edit_report_file = os.path.join(root, "_scan", "edit_report.txt")
    diff_file = os.path.join(root, "_scan", "safe_changes_diff.txt")
    
    safe_changes = []
    files_to_edit = {}
    
    print("🔍 Analyzing matches for safe UI changes...")
    
    # Parse existing matches and filter for safe ones
    with open(report_file, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            line = line.rstrip('\n')
            if not line:
                continue
                
            try:
                parts = line.split(':', 2)
                if len(parts) < 3:
                    continue
                    
                file_path, line_no, line_content = parts
                file_path = file_path.strip()
                line_no = int(line_no.strip())
                line_content = line_content.strip()
                
                # Check if file is in allowed scope
                if not is_allowed_path_and_extension(file_path):
                    continue
                
                # Check if line contains dangerous patterns
                if is_dangerous_line(line_content):
                    print(f"❌ Skipping dangerous line: {file_path}:{line_no}")
                    continue
                
                # This is a safe change candidate
                safe_changes.append({
                    'path': file_path,
                    'line': line_no,
                    'content': line_content
                })
                
                if file_path not in files_to_edit:
                    files_to_edit[file_path] = []
                files_to_edit[file_path].append(line_no)
                
            except Exception as e:
                print(f"Error processing line: {line[:100]}... - {e}")
                continue
    
    print(f"✅ Found {len(safe_changes)} safe change candidates in {len(files_to_edit)} files")
    
    # Write safe changes analysis
    with open(safe_changes_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['path', 'line', 'content'])
        for change in safe_changes:
            writer.writerow([change['path'], change['line'], change['content']])
    
    # Apply changes and generate diffs
    edit_report = []
    all_diffs = []
    files_modified = 0
    
    for file_path in files_to_edit:
        full_path = os.path.join(root, file_path.lstrip('./'))
        
        try:
            # Read original file
            with open(full_path, 'r', encoding='utf-8') as f:
                original_content = f.read()
            
            # Apply replacements
            modified_content = original_content
            
            # Replace neuvisia -> Zinvero (case-preserving)
            modified_content = apply_case_preserving_replacement(modified_content, 'neuvisia', 'Zinvero')
            
            # Replace nerbixa -> Zinvero (case-preserving)  
            modified_content = apply_case_preserving_replacement(modified_content, 'nerbixa', 'Zinvero')
            
            # Check if file was actually modified
            if modified_content != original_content:
                # Generate diff
                original_lines = original_content.splitlines(keepends=True)
                modified_lines = modified_content.splitlines(keepends=True)
                diff = list(difflib.unified_diff(
                    original_lines, 
                    modified_lines,
                    fromfile=f"a/{file_path}",
                    tofile=f"b/{file_path}",
                    lineterm=''
                ))
                
                if diff:
                    all_diffs.extend(diff)
                    all_diffs.append('\n')
                    
                    # Write the modified file
                    with open(full_path, 'w', encoding='utf-8') as f:
                        f.write(modified_content)
                    
                    files_modified += 1
                    edit_report.append(f"✅ Modified: {file_path}")
                    print(f"✅ Applied safe changes to: {file_path}")
        
        except Exception as e:
            edit_report.append(f"❌ Error processing {file_path}: {e}")
            print(f"❌ Error processing {file_path}: {e}")
    
    # Write edit report
    with open(edit_report_file, 'w', encoding='utf-8') as f:
        f.write("SAFE UI REBRAND EDIT REPORT\n")
        f.write("=" * 50 + "\n\n")
        f.write(f"Safe changes found: {len(safe_changes)}\n")
        f.write(f"Files modified: {files_modified}\n\n")
        
        f.write("CHANGES APPLIED:\n")
        for line in edit_report:
            f.write(line + "\n")
    
    # Write unified diff
    if all_diffs:
        with open(diff_file, 'w', encoding='utf-8') as f:
            f.writelines(all_diffs)
    
    print(f"\n📊 SUMMARY:")
    print(f"  Safe changes identified: {len(safe_changes)}")
    print(f"  Files modified: {files_modified}")
    print(f"  Edit report: {edit_report_file}")
    print(f"  Diff preview: {diff_file}")
    
    return files_modified > 0

if __name__ == "__main__":
    main()
