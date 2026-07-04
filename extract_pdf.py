from pdf2image import convert_from_path

pdf_path = 'assets-download/Azure project Campus Managment Siddharth.pdf'
images = convert_from_path(pdf_path, first_page=4, last_page=4)
if images:
    output_path = 'src/assets/images/pdf-page-4.png'
    images[0].save(output_path, 'PNG')
    print(f'Page 4 extracted successfully to {output_path}')
else:
    print('Failed to extract page 4')
