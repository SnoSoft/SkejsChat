const postcssJitProps = require('postcss-jit-props');
const openProps = require('open-props');
const config = {
	plugins: [
		postcssJitProps(openProps),
	]
};

module.exports = config;