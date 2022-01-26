package onl_fiber

import (
	"fmt"
	"io/ioutil"
	"net"
	"strconv"
	"strings"
	"time"

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
	jsonData := onl_func.JsonForTemplate(result, view)
	return c.Render(index_filepath_without_ext, jsonData, template_path_without_ext)
}

func getFolder(c *fiber.Ctx) error {
	files, err := ioutil.ReadDir("./public/html/")
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}

	var menu_folder []interface{}
	i := 1
	for _, f := range files {
		data := map[string]interface{}{
			"id":    i,
			"value": strings.ToUpper(f.Name()),
			"src":   f.Name(),
			"icon":  "fas fa-table",
		}
		menu_folder = append(menu_folder, data)
		i++
	}
	return c.JSON(menu_folder)
}

func gridTemplatev1(c *fiber.Ctx) error {
	conn, error := net.Dial("udp", "8.8.8.8:80")
	if error != nil {
		fmt.Println(error)
	}
	defer conn.Close()
	addr := conn.LocalAddr().(*net.UDPAddr)
	api_address := addr.IP
	api_key := strconv.Itoa(int(time.Now().Month()) + 100)
	return c.Render("html/grid_template/index", fiber.Map{
		"api_address": api_address,
		"api_key":     api_key,
		"folder":	  "grid_template",
	} , "html_template/webix_tailwind_header")
}