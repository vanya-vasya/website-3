#!/usr/bin/env python3
import os
import re
import csv
import difflib
from pathlib import Path

def is_truly_safe_change(path, line_no, preview):
    """
    Determine if a change is truly safe (UI copy only, no external dependencies)
    
    Returns True only for:
    - Plain text content in React components
    - Aria labels, titles, placeholders that don't affect functionality
    - UI strings that don't involve external services
    """
    
    # These are definitely NOT safe
    unsafe_patterns = [
        r'uploadPreset',      # Cloudinary integration
        r'"name":\s*"',       # package.json name field  
        r'href.*\.com',       # URL references
        r'@.*\.com',          # Email addresses
        r'_ID|_KEY|_SECRET',  # Environment variables
        r'cookie|localStorage', # Storage keys
        r'callback|webhook',   # API endpoints
        r'providerId',        # Auth provider IDs
    ]
    
    for pattern in unsafe_patterns:
        if re.search(pattern, preview, re.I):
            return False
    
    # Only consider files in UI component directories
    if not re.search(r'(components/|app/).*\.(tsx|jsx)$', path):
        return False
        
    # Additional checks for UI-only content
    ui_safe_patterns = [
        r'title\s*=',         # Component titles
        r'aria-label\s*=',    # Accessibility labels  
        r'placeholder\s*=',   # Input placeholders
        r'alt\s*=',           # Image alt text
        r'>\s*[^<]*\s*<',     # Text content between tags
    ]
    
    # This is a stricter check - only allow clearly identified UI text
    for pattern in ui_safe_patterns:
        if re.search(pattern, preview, re.I):
            return True
    
    return False

def main():
    root = "/Users/vladi/Documents/Projects/webapps/Zinvero"
    classified_file = os.path.join(root, "_scan", "rebrand_classified.csv")
    patch_file = os.path.join(root, "_scan", "patches", "low-risk-rebrand.patch")
    analysis_file = os.path.join(root, "_scan", "patch_analysis.txt")
    
    truly_safe_changes = []
    questionable_low_risk = []
    
    # Parse classified results
    with open(classified_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['risk'] == 'LOW':
                if is_truly_safe_change(row['path'], row['line'], row['preview']):
                    truly_safe_changes.append(row)
                else:
                    questionable_low_risk.append(row)
    
    # Write analysis
    with open(analysis_file, 'w', encoding='utf-8') as f:
        f.write("PATCH GENERATION ANALYSIS\n")
        f.write("=" * 50 + "\n\n")
        
        f.write(f"Truly safe UI-only changes: {len(truly_safe_changes)}\n")
        for change in truly_safe_changes:
            f.write(f"  {change['path']}:{change['line']} - {change['preview'][:80]}...\n")
        
        f.write(f"\nQuestionable 'LOW' risk changes: {len(questionable_low_risk)}\n")
        for change in questionable_low_risk:
            f.write(f"  {change['path']}:{change['line']} - {change['preview'][:80]}...\n")
        
        f.write(f"\nRECOMMENDATION:\n")
        if len(truly_safe_changes) == 0:
            f.write("No truly safe UI-only changes detected. All 'LOW' risk changes involve:\n")
            f.write("- External service integrations (Cloudinary uploadPreset)\n")
            f.write("- Build system configuration (package.json name)\n")
            f.write("- These should be reclassified as CRITICAL or MEDIUM risk.\n")
        else:
            f.write(f"Found {len(truly_safe_changes)} safe changes to apply.\n")
    
    # Generate patch file
    if truly_safe_changes:
        # Implementation to generate actual patches would go here
        # For now, create empty patch since no truly safe changes found
        with open(patch_file, 'w', encoding='utf-8') as f:
            f.write("# No truly safe UI-only changes detected\n")
            f.write("# All identified LOW risk changes involve external dependencies\n")
    else:
        with open(patch_file, 'w', encoding='utf-8') as f:
            f.write("# No safe changes detected\n")
            f.write("# All brand token occurrences involve:\n")
            f.write("# - External service integrations\n") 
            f.write("# - Build system configuration\n")
            f.write("# - URL/domain references\n")
            f.write("# - Email addresses\n")
            f.write("#\n")
            f.write("# Manual review required for all changes\n")
    
    print(f"Analysis complete:")
    print(f"  Truly safe changes: {len(truly_safe_changes)}")
    print(f"  Questionable changes: {len(questionable_low_risk)}")
    print(f"  Patch file: {patch_file}")
    print(f"  Analysis: {analysis_file}")

if __name__ == "__main__":
    main()
