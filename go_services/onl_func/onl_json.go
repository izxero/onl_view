package onl_func

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net"
	"os"
	"strconv"
	"time"
)

func ReadFileJson(file_path string) (map[string]interface{}, error) {
	jsonFile, err := os.Open(file_path)
	if err != nil {
		return nil, err
	}
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)
	var result map[string]interface{}
	json.Unmarshal([]byte(byteValue), &result)
	return result, nil
}

func JsonForTemplate(data map[string]interface{}, view string) map[string]interface{} {
	conn, error := net.Dial("udp", "8.8.8.8:80")
	if error != nil {
		fmt.Println(error)

	}

	defer conn.Close()
	addr := conn.LocalAddr().(*net.UDPAddr)
	data["api_address"] = addr.IP
	data["api_key"] = strconv.Itoa(int(time.Now().Month()) + 100)
	data["folder"] = view
	return data
}
