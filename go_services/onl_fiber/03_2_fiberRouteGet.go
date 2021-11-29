package onl_fiber

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/savirusing/onl_view/go_services/onl_func"
)

func getView(c *fiber.Ctx) error {
	view := c.Params("view")
	switch view {
	case "":
		return RenderView("home", "webix", c)
	case "stimulsoft":
		return c.SendString(view)
	default:
		return RenderView(view, "webix", c)
	}
}

func RenderView(view string, template string, c *fiber.Ctx) error {
	template_path_without_ext := ""
	switch template {
	case "webix":
		template_path_without_ext = "html_template/webix_header"
	case "stimulsoft":
		template_path_without_ext = "html_template/stimulsoft_header"
	}
	index_filepath_without_ext := fmt.Sprintf("html/%v/index", view)
	result, err := onl_func.ReadFileJson("./public/html_template/html_variable.json")
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	jsonData := onl_func.JsonForTemplate(result)
	return c.Render(index_filepath_without_ext, jsonData, template_path_without_ext)
}
