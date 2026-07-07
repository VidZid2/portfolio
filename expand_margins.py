import os
import re
import sys

def update_margins(target_percentage):
    changed_files = []
    
    # We want to replace any [XX%] with the new target percentage.
    # To be safe, we'll only replace the specific percentage we are currently at, 
    # but since we might not know it, let's just replace all 15,20,25,26,28,30% with the target.
    
    for root, dirs, files in os.walk('src'):
        if 'node_modules' in root or '.next' in root:
            continue
            
        for file in files:
            if file.endswith('.tsx'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                
                # Replace classes like left-[26%] to left-[target%]
                new_content = re.sub(r'left-\[(15|20|25|26|28|30)%\]', f'left-[{target_percentage}%]', new_content)
                new_content = re.sub(r'right-\[(15|20|25|26|28|30)%\]', f'right-[{target_percentage}%]', new_content)
                new_content = re.sub(r'ml-\[(15|20|25|26|28|30)%\]', f'ml-[{target_percentage}%]', new_content)
                new_content = re.sub(r'mr-\[(15|20|25|26|28|30)%\]', f'mr-[{target_percentage}%]', new_content)
                
                # Replace inline styles like left: '26%'
                new_content = re.sub(r"left:\s*'(15|20|25|26|28|30)%'", f"left: '{target_percentage}%'", new_content)
                new_content = re.sub(r"right:\s*'(15|20|25|26|28|30)%'", f"right: '{target_percentage}%'", new_content)
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    changed_files.append(path)

    print(f'Updated to {target_percentage}% files:', changed_files)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        update_margins(sys.argv[1])
    else:
        print("Please provide a target percentage, e.g., 'python expand_margins.py 26'")
