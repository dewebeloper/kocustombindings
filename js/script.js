
var UP = UP || {};

$(function () {
   function ArticleVModel(model) {
      var self = this;

      self.contentHtml = ko.observable(model.contentHtml || '').extend({
         required: {
            message: 'Polje Sadrzaj je obavezno.'
         }, minLength: { params: 150, message: 'Sadrzaj mora imati bar 150 karaktera.' }
      });
      self.publishDate = ko.observable(model.publishDate || '');

      self.published = ko.observable(model.published || '');
    

      self.validateModel = ko.validatedObservable({
         contentHtml: self.contentHtml
      });

   }


   ko.validation.init({
      errorElementClass: 'has-error',
      errorMessageClass: 'help-block',
      decorateElement: true
   });


   UP.article = function () {
      var _article = ko.observable();

      var doclick = function () {
         //console.log(ko.toJSON(_registration));

         if (!_article().validateModel().isValid()) {
            _article().validateModel().errors.showAllMessages(true);
            return;
         }


         toastr.success(ko.toJSON(_article));

         //ajax call
      }

      var init = function () {
         var jsonData = { contentHtml: '', publishDate: new Date(), published: false };
         var A = new ArticleVModel(jsonData);

         _article(A);

         var element = $('#registration-form')[0];
         //ko.cleanNode(element);
         ko.applyBindings(UP.article, element);
      }


      return {
         init: init,
         _article: _article,
         doclick: doclick
      }
   }();

   UP.article.init();
});
