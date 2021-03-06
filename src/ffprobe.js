Scoped.require([
    "betajs:Promise"
], function (Promise) {

	var DockerPolyfill = require("docker-polyfill");
	
	module.exports = {
			
		ffprobe: function (fileName, options) {
			options = options || {};
			var promise = Promise.create();
			var file = DockerPolyfill.polyfillRun({
				command: options.ffprobe_binary || "ffprobe",
				argv: ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', fileName],
				docker: options.docker,
                timeout: options.timeout
			});
			/*
            var stderr = "";
            file.stderr.on("data", function (data) {
                stderr += data;
            });
            */
            var stdout = "";
            file.stdout.on("data", function (data) {
                stdout += data;
            });
            file.on("close", function (status) {
                if (status !== 0) {
                    promise.asyncError(status === null ? "Timeout reached" : "Cannot read file");
                    return;
                }
                try {
                    var success = JSON.parse(stdout);
                    promise.asyncSuccess(success);
                } catch (e) {
                    promise.asyncError("FFProbe Parse error: " + stdout);
                }
			});
			return promise;
		}
			
	};	
	
});

