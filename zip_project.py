import os
import zipfile

def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        # Exclude node_modules and .git
        if 'node_modules' in root or '.git' in root or '__pycache__' in root:
            continue
        for file in files:
            # Exclude other zip files to avoid huge recursion or unneeded files
            if file.endswith('.zip'):
                continue
            filepath = os.path.join(root, file)
            arcname = os.path.relpath(filepath, path)
            ziph.write(filepath, arcname)

if __name__ == '__main__':
    zip_path = 'W8_Submission_TBI-26100454.zip'

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipdir('.', zipf)
    print(f"Created {zip_path}")
