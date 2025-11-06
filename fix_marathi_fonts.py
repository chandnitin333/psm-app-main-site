import os
import re

# List of files to fix
files = [
    "src/app/pages/ahval/mobile-number/ward-wise-mobile-no-list/ward-wise-mobile-no-list.component.ts",
    "src/app/pages/ahval/toilet-yadi/ward-wise-toilet-list/ward-wise-toilet-list.component.ts",
    "src/app/pages/ahval/pani-vyavasta-yadi/ward-wise-pinyache-pani-list/ward-wise-pinyache-pani-list.component.ts",
    "src/app/pages/ahval/namuna8formNew/anukramika/anukramika.component.ts",
    "src/app/pages/ahval/namuna8formNew/namuna81-single-ward/namuna81-single-ward.component.ts",
    "src/app/pages/ahval/namuna8formNew/namuna8ward-new/namuna8ward-new.component.ts",
    "src/app/pages/ahval/namuna8formNew/namuna-8-ghosvara/namuna-8-ghosvara.component.ts",
    "src/app/pages/ahval/namuna8formNew/namuna-8-sarkari-ward/namuna-8-sarkari-ward.component.ts",
    "src/app/pages/ahval/namuna8formNew/namuna-8-images/namuna-8-images.component.ts",
    "src/app/pages/ahval/namuna9form-new/namuna9/namuna9.component.ts",
    "src/app/pages/ahval/namuna9form-new/namuna9-new/namuna9-new.component.ts",
    "src/app/pages/ahval/namuna9form-new/namuna9-ghosvara/namuna9-ghosvara.component.ts",
    "src/app/pages/ahval/malmatta-grahak-yadi/malmatta-dharkachi-yadi/malmatta-dharkachi-yadi.component.ts",
    "src/app/pages/ahval/malmatta-grahak-yadi/malmatta-grahak-yadi-ghar-kar/malmatta-grahak-yadi-ghar-kar.component.ts",
    "src/app/pages/ahval/malmatta-grahak-yadi/malmatta-grahak-yadi-khula-bhukhand/malmatta-grahak-yadi-khula-bhukhand.component.ts",
    "src/app/pages/ahval/imla-kar-form-new/imlakar-anukramanika/imlakar-anukramanika.component.ts",
    "src/app/pages/ahval/imla-kar-form-new/imlakar-report/imlakar-report.component.ts",
    "src/app/pages/ahval/magniche-bill-ward/report-129-1/report-129-1.component.ts",
    "src/app/pages/ahval/magniche-bill-ward/report-129-2/report-129-2.component.ts",
    "src/app/pages/customer/namuna-8-1/namuna-8-1.component.ts",
    "src/app/pages/customer/namuna-8-sarkari/namuna-8-sarkari.component.ts",
    "src/app/pages/customer/namuna-8-new-version-customer-page/namuna-8-new-version-customer-page.component.ts",
    "src/app/pages/customer/namuna-9-1/namuna-9-1.component.ts",
]

# Pattern to find and replace
old_pattern = r'(<head>\s*<title>Print Preview</title>\s*<style>)'
new_replacement = r'''<head>
        <meta charset="UTF-8">
        <title>Print Preview</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet">
        <style>
          * {
            font-family: 'Noto Sans Devanagari', Arial, sans-serif !important;
          }'''

count = 0
for file_path in files:
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Check if file has the pattern
            if '<title>Print Preview</title>' in content and 'downloadPDFMobile' in content:
                # Replace the pattern
                new_content = re.sub(old_pattern, new_replacement, content)

                # Only write if something changed
                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"[OK] Fixed: {file_path}")
                    count += 1
                else:
                    print(f"[SKIP] Already fixed: {file_path}")
            else:
                print(f"[SKIP] No downloadPDFMobile: {file_path}")
        except Exception as e:
            print(f"[ERROR] {file_path}: {e}")
    else:
        print(f"[NOT FOUND] {file_path}")

print(f"\n[DONE] Total files fixed: {count}")
