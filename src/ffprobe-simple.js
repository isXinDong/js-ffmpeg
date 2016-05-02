Scoped.require([
    "betajs:Promise",
    "betajs:Strings"
], function (Promise, Strings) {
	
	module.exports = {
			
		ffprobe_simple: function (file) {
			if (!require('fs').existsSync(file))
				return Promise.error("File does not exist");
			return require(__dirname + "/ffprobe.js").ffprobe(file).mapSuccess(function (json) {
				var result = {
					filename: json.format.filename,
					stream_count: json.format.nb_streams,
					size: parseInt(json.format.size, 10),
					bit_rate: parseInt(json.format.bit_rate, 10),
					start_time: parseFloat(json.format.start_time),
					duration: parseFloat(json.format.duration),
					format_name: json.format.format_long_name,
					format_extensions: json.format.format_name.split(","),
					format_default_extension: Strings.splitFirst(json.format.format_name, ",").head				
				};
				json.streams.forEach(function (stream) {
					if (stream.codec_type === 'video') {
						result.video = {
							index: stream.index,
							rotation: stream.tags && stream.tags.rotate ? parseInt(stream.tags.rotate, 10) : 0,
							width: stream.width,
							height: stream.height,
							codec_name: stream.codec_tag_string,
							codec_long_name: stream.codec_long_name,
							codec_profile: stream.profile,
							bit_rate: parseInt(stream.bit_rate, 10)
						};
					} else if (stream.codec_type === 'audio') {
						result.audio = {
							index: stream.index,
							codec_name: stream.codec_name,
							codec_long_name: stream.codec_long_name,
							codec_profile: stream.profile,
							audio_channels: stream.channels,
							sample_rate: parseInt(stream.sample_rate, 10),
							bit_rate: parseInt(stream.bit_rate, 10)
						};
					}
				});
				return result;
			});
		}
			
	};

});
