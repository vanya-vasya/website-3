#!/usr/bin/env python3
import re
import sys
import csv
import os
from collections import Counter

def classify_risk(path, preview):
    """Classify a match as CRITICAL, MEDIUM, or LOW risk"""
    
    # CRITICAL path patterns
    critical_paths = [
        r'\.env', r'next\.config', r'vercel\.json', r'\.vercel/',
        r'docker', r'\.ya?ml', r'config/', r'pages/api/', r'app/api/',
        r'lib/', r'server/', r'services/', r'utils/', r'prisma/',
        r'migrations/', r'scripts/', r'\.github/'
    ]
    
    # CRITICAL line content patterns  
    danger_patterns = [
        r'(http|https):\/\/',  # URLs
        r'@.*\.com',           # Email addresses
        r'\.com', r'\.io',     # Domain references
        r'_ID', r'_KEY', r'_SECRET',  # Environment variables
        r'cookie', r'localStorage',   # Storage references
        r'callback', r'providerId', r'webhook'  # API/service integrations
    ]
    
    # Check path patterns
    for pattern in critical_paths:
        if re.search(pattern, path, re.I):
            return 'CRITICAL'
    
    # Check line content patterns
    for pattern in danger_patterns:
        if re.search(pattern, preview, re.I):
            return 'CRITICAL'
    
    # MEDIUM risk patterns
    medium_patterns = [
        r'public/', r'emails?/', r'analytics', r'payment', 
        r'stripe', r'networx', r'auth'
    ]
    
    for pattern in medium_patterns:
        if re.search(pattern, path, re.I):
            return 'MEDIUM'
    
    return 'LOW'

def main():
    root = "/Users/vladi/Documents/Projects/webapps/Zinvero"
    report_file = os.path.join(root, "_scan", "brand_tokens_report.txt")
    classified_file = os.path.join(root, "_scan", "rebrand_classified.csv")
    summary_file = os.path.join(root, "_scan", "rebrand_summary.csv")
    do_not_touch_file = os.path.join(root, "_scan", "do_not_touch.txt")
    
    rows = []
    critical_paths = set()
    
    # Parse the report file
    with open(report_file, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            line = line.rstrip('\n')
            if not line:
                continue
            
            try:
                parts = line.split(':', 2)
                if len(parts) < 3:
                    continue
                    
                path, line_no, preview = parts
                path = path.strip()
                line_no = line_no.strip()
                preview = preview.strip()
                
                # Classify the risk
                risk = classify_risk(path, preview)
                
                if risk == 'CRITICAL':
                    critical_paths.add(path)
                
                rows.append((risk, path, line_no, preview))
                
            except Exception as e:
                print(f"Error processing line: {line[:100]}... - {e}", file=sys.stderr)
                continue
    
    # Write classified results
    with open(classified_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['risk', 'path', 'line', 'preview'])
        writer.writerows(rows)
    
    # Write summary by risk level
    risk_counts = Counter(row[0] for row in rows)
    with open(summary_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['bucket', 'count'])
        for risk, count in sorted(risk_counts.items()):
            writer.writerow([risk, count])
    
    # Write do-not-touch list
    with open(do_not_touch_file, 'w', encoding='utf-8') as f:
        for path in sorted(critical_paths):
            f.write(path + '\n')
    
    print(f"Classification complete:")
    print(f"  Total matches: {len(rows)}")
    print(f"  Critical: {risk_counts.get('CRITICAL', 0)}")
    print(f"  Medium: {risk_counts.get('MEDIUM', 0)}")
    print(f"  Low: {risk_counts.get('LOW', 0)}")
    print(f"  Critical files: {len(critical_paths)}")

if __name__ == "__main__":
    main()
