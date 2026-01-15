#!/bin/bash

# Travel Blog HLD - PDF Conversion Script
# This script converts the Markdown HLD document to a professional PDF

# Navigate to HLD directory
cd "$(dirname "$0")"

echo "========================================="
echo "Travel Blog HLD - PDF Converter"
echo "========================================="
echo ""

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "❌ Pandoc is not installed."
    echo ""
    echo "To install Pandoc:"
    echo "  macOS:   brew install pandoc && brew install basictex"
    echo "  Ubuntu:  sudo apt-get install pandoc texlive-latex-base"
    echo "  Windows: Download from https://pandoc.org/installing.html"
    echo ""
    exit 1
fi

echo "✅ Pandoc found: $(pandoc --version | head -n 1)"
echo ""

# Check if xelatex is available
if ! command -v xelatex &> /dev/null; then
    echo "⚠️  XeLaTeX not found. Using default PDF engine."
    echo "   For better output, install a TeX distribution."
    PDF_ENGINE="pdflatex"
else
    echo "✅ XeLaTeX found"
    PDF_ENGINE="xelatex"
fi

echo ""
echo "Converting travel_blog_hld.md to PDF..."
echo "----------------------------------------"

# Convert to PDF with professional styling
pandoc travel_blog_hld.md -o travel_blog_hld.pdf \
  --pdf-engine=$PDF_ENGINE \
  --toc \
  --toc-depth=3 \
  --number-sections \
  -V geometry:margin=1in \
  -V fontsize=11pt \
  -V documentclass=report \
  -V colorlinks=true \
  -V linkcolor=blue \
  -V urlcolor=blue \
  -V toccolor=black \
  -V title="Travel Blog Platform - High Level Design" \
  -V author="System Architecture Team" \
  -V date="January 15, 2026" \
  --highlight-style=tango \
  2>&1

# Check if conversion was successful
if [ $? -eq 0 ] && [ -f "travel_blog_hld.pdf" ]; then
    FILE_SIZE=$(du -h travel_blog_hld.pdf | cut -f1)
    echo ""
    echo "========================================="
    echo "✅ PDF generated successfully!"
    echo "========================================="
    echo ""
    echo "Output file: travel_blog_hld.pdf"
    echo "File size: $FILE_SIZE"
    echo "Location: $(pwd)/travel_blog_hld.pdf"
    echo ""
    
    # Attempt to open the PDF
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        echo "Opening PDF..."
        open travel_blog_hld.pdf
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v xdg-open &> /dev/null; then
            echo "Opening PDF..."
            xdg-open travel_blog_hld.pdf
        fi
    fi
    
    echo ""
    echo "Note: Mermaid diagrams are rendered as code blocks."
    echo "      For rendered diagrams, use Typora or md-to-pdf."
    echo "      See README_PDF_CONVERSION.md for details."
    
else
    echo ""
    echo "========================================="
    echo "❌ PDF generation failed"
    echo "========================================="
    echo ""
    echo "Please check the error messages above."
    echo "See README_PDF_CONVERSION.md for troubleshooting."
    exit 1
fi
