# clean_project.py

import shutil
import os

# Folders to clean
folders_to_clean = ["uploads", "vectorstore"]

for folder in folders_to_clean:
    if os.path.exists(folder):
        shutil.rmtree(folder)
        print(f"✅ Successfully cleaned: {folder}")
    else:
        print(f"ℹ️  Folder not found (already clean): {folder}")

print("\n🎯 All target folders cleaned. Ready for fresh uploads!")
