<!DOCTYPE html>
<!--[if IE 9]><html class="lt-ie10" lang="en" > <![endif]-->
<html class="no-js" lang="en" >
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
		<meta charset="utf-8">
		<?php if (!empty($title)) { ?>
			<title><?= $title ; ?></title>
		<?php } else { ?>
			<title>Codeigniter & Foundation Boilerplate</title>
		<?php } ?>
		<link rel="stylesheet" href="<?php echo base_url(); ?>assets/css/normalize.css" />
		<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet" />
		<link rel="stylesheet" href="<?php echo base_url(); ?>assets/css/foundation.min.css" />
		<link rel="stylesheet" href="<?php echo base_url(); ?>assets/css/style.css" />
		<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/vendor/modernizr.js"></script>
		<script type="text/javascript" src="<?php echo base_url();?>assets/js/vendor/jquery.js"></script>
		<script type="text/javascript" src="<?php echo base_url();?>assets/js/angular.min.js"></script>

		<?php if (isset($css_to_load)) :
				foreach ($css_to_load as $css) : ?>
					<link rel="stylesheet" href="<?php echo base_url();?>assets/css/<?=$css;?>" />
		<?php endforeach;?>

	<?php endif;?>
	</head>
	<body>


	<section role="main" class="outer-wrap">
