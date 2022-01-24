package onl_fiber

import (
	"github.com/gofiber/fiber/v2"
)

func fiberRoute(app *fiber.App) {
	//get folder api
	app.Get("/menu",getFolder)

	// Create Group as ==> host:port/log/...
	apiLog := app.Group("/log")
	apiLog.Get("/get/:date?", readLog) // api to get log file as json from today (or specific date) ==> host:port/log/get/?date? == format "yyyymmdd"

	// Render view ==> host:port/view
	app.Get("/:view?", getView)
	app.Static("/", "./public")
}

// func checkKey(c *fiber.Ctx) error {
// 	key := c.Params("key")
// 	current := time.Now()
// 	api_key := strconv.Itoa(100 + int(current.Month()))
// 	if api_key == key {
// 		return c.Next()
// 	}
// 	err := errors.New("invalid key for api")
// 	return c.JSON(onl_func.ErrorReturn(err, c))
// }
