package main

import (
	"fmt"
	"strconv"
	"syscall/js"
)

var done = make(chan struct{})

func main() {
	callback := js.FuncOf(printResult)
	defer callback.Release()
	setResult := js.Global().Get("setResult")
	setResult.Invoke(callback)
	<-done
}

func printResult(value js.Value, args []js.Value) interface{} {
	value1 := args[0].String()
	v1, err := strconv.Atoi(value1)
	if err != nil {
		fmt.Errorf("error %s", err.Error())
		return err
	}
	value2 := args[1].String()
	v2, err := strconv.Atoi(value2)
	if err != nil {
		fmt.Errorf("error %s", err.Error())
		return err
	}

	fmt.Printf("%d\n", v1+v2)
	done <- struct{}{}
	return nil
}
