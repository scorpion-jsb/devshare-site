angular.module("hypercube.const", [])

.constant("VERSION", "0.0.0")

.constant("CONST", {
	"local": {
		"SERVER_URL": "http://localhost:4000",
		"FB_URL": "https://pruvit.firebaseio.com/hypercube"
	},
	"production": {
		"SERVER_URL": "http://hyper-cube.herokuapp.com",
		"FB_URL": "https://pruvit.firebaseio.com/hypercube"
	}
})

;