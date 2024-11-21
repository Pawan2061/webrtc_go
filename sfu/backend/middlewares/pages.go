package middlewares

import (
	"os"

	"github.com/pdfcpu/pdfcpu/pkg/api"
)

func GetPDFPageCount(filePath string) (int, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return 0, err
	}
	defer file.Close()
	ctx, err := api.ReadContext(file, nil)
	if err != nil {
		return 0, err
	}

	return ctx.PageCount, nil
}
