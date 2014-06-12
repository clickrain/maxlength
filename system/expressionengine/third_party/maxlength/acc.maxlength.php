<?php if (! defined('BASEPATH')) exit('No direct script access allowed');

class Maxlength_acc {
	var $name = 'Max Length';
	var $id = 'maxlength';
	var $version = '1.0.0-alpha';
	var $settings_exist = 'n';
	var $docs_url = 'https://github.com/click-rain/maxlength';
	var $description = 'Show and enforce the maximum length of a standard text field.';
	var $settings = array();
	var $sections = array();

	function __construct()
	{
		$this->EE =& get_instance();
	}

	function set_sections() {
		$class = $this->EE->router->class;
		$method = $this->EE->router->method;

		if ($class == 'content_publish' && $method == 'entry_form') {
			$this->_include_theme_js('js/maxlength.js');
			$this->_include_theme_css('css/maxlength.css');
		}
	}

	function update() {
		return TRUE;
	}

	protected function _include_theme_js($file) {
		$this->EE->cp->add_to_foot('<script type="text/javascript" src="'.$this->_theme_url().$file.'?version='.$this->version.'"></script>');
	}

	protected function _include_theme_css($file) {
		$this->EE->cp->add_to_head('<link rel="stylesheet" href="'.$this->_theme_url().$file.'?version='.$this->version.'">');
	}

	protected function _theme_url()
	{
		if (! isset($this->cache['theme_url']))
		{
			$theme_folder_url = defined('URL_THIRD_THEMES') ? URL_THIRD_THEMES : $this->EE->config->slash_item('theme_folder_url').'third_party/';
			$this->cache['theme_url'] = $theme_folder_url.'maxlength/';
		}

		return $this->cache['theme_url'];
	}
}
