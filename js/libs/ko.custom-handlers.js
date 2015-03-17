
(function () {

   ko.bindingHandlers.tocheckbox = {
      init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
         var value = ko.utils.unwrapObservable(valueAccessor());

         var $base = $(element);
         $base.html('');
         var label = allBindingsAccessor().label;
         var color = allBindingsAccessor().color;
         $base.append("<button type='button' class='btn' >&nbsp;" + label + "</button>");
         $base.append("<input type='checkbox' name='t_and_c' id='t_and_c' class='hidden'>");
         var $button = $base.find('button'), $checkbox = $base.find('input:checkbox');
         $checkbox.prop('checked', value);
         var icons = {
            on: {
               icon: 'glyphicon glyphicon-check'
            },
            off: {
               icon: 'glyphicon glyphicon-unchecked'
            }
         };

         $button.on('click', function () {
            var newvalue = valueAccessor();
            var value = ko.utils.unwrapObservable(valueAccessor());
            value = !value;
            $checkbox.prop('checked', value);
            newvalue(value);
         });

         ko.bindingHandlers.tocheckbox.updateDisplay($button, $checkbox, icons, color);
         if ($button.find('.state-icon').length == 0) {
            $button.prepend('<i class="state-icon ' + icons[$button.data('state')].icon + '"></i>');
         }
      },
      update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
         var value = ko.utils.unwrapObservable(valueAccessor());//iz nekog razloga mora da stoji ova linija!!!
         var $base = $(element);
         //$base.html('');
         var $button = $base.find('button'), $checkbox = $base.find('input:checkbox');
         var color = allBindingsAccessor().color;
         var icons = {
            on: {
               icon: 'glyphicon glyphicon-check'
            },
            off: {
               icon: 'glyphicon glyphicon-unchecked'
            }
         };
         ko.bindingHandlers.tocheckbox.updateDisplay($button, $checkbox, icons, color);
      },
      updateDisplay: function ($button, $checkbox, icons, color) {
         var isChecked = $checkbox.is(':checked');

         // Set the button's state
         $button.data('state', (isChecked) ? "on" : "off");

         // Set the button's icon
         $button.find('.state-icon')
             .removeClass()
             .addClass('state-icon ' + icons[$button.data('state')].icon);

         // Update the button's color
         if (isChecked) {
            $button
                .removeClass('btn-default')
                .addClass('btn-' + color + ' active');
         }
         else {
            $button
                .removeClass('btn-' + color + ' active')
                .addClass('btn-default');
         }
      }
   }

   ko.bindingHandlers.ckeditor = {
      init: function (element, valueAccessor, allBindingsAccessor, context) {
         var options = allBindingsAccessor().ckeditorOptions || {};
         var modelValue = valueAccessor();
         var value = ko.utils.unwrapObservable(valueAccessor());

         $(element).html(value);
         var config = {};
         config.toolbar = [
	         { name: 'document', groups: ['mode'], items: ['Source'] },
	         { name: 'clipboard', groups: ['clipboard', 'undo'], items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
	         { name: 'editing', groups: ['find', 'selection', 'spellchecker'], items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'] },
	         { name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
             '/',
            { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language'] },
	         { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
	         //{ name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
	         '/',
	         { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
	         { name: 'colors', items: ['TextColor', 'BGColor'] },
	         { name: 'tools', items: ['Maximize'] },
	         { name: 'others', items: ['-'] },
	         //{ name: 'about', items: ['About'] }
         ];
         config.toolbarGroups = [
	         { name: 'document', groups: ['mode', 'document', 'doctools'] },
	         { name: 'clipboard', groups: ['clipboard', 'undo'] },
	         { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
	         { name: 'forms' },
	         '/',
	         { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
	         { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
	         { name: 'links' },
	         { name: 'insert' },
	         '/',
	         { name: 'styles' },
	         { name: 'colors' },
	         { name: 'tools' },
	         { name: 'others' },
	         { name: 'about' }
         ];
         $(element).ckeditor(config);

         var editor = $(element).ckeditorGet();

         //handle edits made in the editor
         editor.on('blur', function (e) {
            var self = this;
            if (ko.isWriteableObservable(self)) {
               self($(e.listenerData).val());
            }
         }, modelValue, element);
         editor.on('keyup', function (e) {
            var self = this;
            if (ko.isWriteableObservable(self)) {
               self($(e.listenerData).val());
            }
         }, modelValue, element);
         editor.on('change', function (e) {
            var self = this;
            if (ko.isWriteableObservable(self)) {
               self($(e.listenerData).val());
            }
         }, modelValue, element);

         //handle destroying an editor (based on what jQuery plugin does)
         ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            var existingEditor = CKEDITOR.instances[element.name];
            existingEditor.destroy(true);
         });
      },
      update: function (element, valueAccessor, allBindingsAccessor, context) {
         //handle programmatic updates to the observable
         var value = ko.utils.unwrapObservable(valueAccessor());
         $(element).html(value);
      }
   };


   ko.bindingHandlers.mydatepicker = {
      init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
         var dpoptions = allBindings().dpoptions || {};
         $(element).datepicker(dpoptions);

         //handle the field changing
         ko.utils.registerEventHandler(element, "change", function (event) {
            var observable = valueAccessor();
            observable($(element).datepicker("getDate"));
         });

         //handle disposal (if KO removes by the template binding)
         ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).datepicker("remove");
         });
      },
      update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
         var value = ko.utils.unwrapObservable(valueAccessor());
         var current = $(element).datepicker("getDate");

         if (value - current !== 0) {
            //console.log(value);
            if (Object.prototype.toString.call(value) === "[object Date]") {
               if (isNaN(value.getTime())) {  // d.valueOf() could also work
                  // date is not valid
                  //console.log('date is not valid');
               }
               else {
                  // date is valid
                  $(element).datepicker("setDate", value);
               }
            }
            //$(element).datepicker("setDate", value);
         }
      }
   }




})();