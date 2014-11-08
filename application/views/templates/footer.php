	</section>
  <footer>


  </footer>
</body>
<script type="text/javascript" src="<?php echo base_url();?>assets/js/foundation.min.js"></script>
<? if (isset($js_to_load)) :
		foreach ($js_to_load as $js) : ?>
			<script type="text/javascript" src="<?php echo base_url();?>assets/js/<?=$js;?>"></script>
<?php endforeach;?>
<? endif;?>
<script type="text/javascript" src="<?php echo base_url();?>assets/js/foundation.min.js"></script>
<script type="text/javascript" src="<?php echo base_url();?>assets/js/script.js"></script>

</html>
