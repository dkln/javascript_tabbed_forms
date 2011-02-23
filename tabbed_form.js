var TabbedForm = function(root) {
  this.root = $(root);
  this.initialize();
}

TabbedForm.prototype = {
  initialize: function() {
    this.initSteps();
    this.initBehaviour();

    this.hideSteps();
    this.showStartStep();
  },

  initSteps: function() {
    var self = this;

    this.steps = [];
    this.root.find('li a').each(function() { self.steps.push($(this).attr('rel')); });
  },

  initBehaviour: function() {
    var self = this;

    this.root.find('li a').click( function() {
      self.hideStep(self.activeStep());
      self.showStep($(this).attr('rel'));
    });

    $('fieldset.buttons button.tab-previous').click( function(event) {
      var newStep = self.steps[self.activeStepIndex() - 1];

      event.preventDefault();
      self.hideStep(self.activeStep());
      self.showStep(newStep);
    });

    $('fieldset.buttons button.tab-next').click( function(event) {
      var newStep = self.steps[self.activeStepIndex() + 1];

      event.preventDefault();
      self.hideStep(self.activeStep());
      self.showStep(newStep);
    });
  },

  startStep: function() {
    var errors = $('fieldset div.field_with_errors');
    var i = 0;

    if(errors.length > 0) {
      for(i = 0; i < this.steps.length; i++) {
        if($(errors[0]).closest('#' + this.steps[i]).length > 0) {
          return this.steps[i];
        }
      }
    }

    return this.steps[0];
  },

  showButtons: function() {
    if(this.steps.indexOf(this.activeStep()) == 0) {
      $('fieldset button.tab-previous').hide();
    } else {
      $('fieldset button.tab-previous').show();
    }

    if(this.steps.indexOf(this.activeStep()) == this.steps.length - 1) {
      $('fieldset button.tab-next').hide();
    } else {
      $('fieldset button.tab-next').show();
    }
  },

  hideSteps: function() {
    for(var i = 0; i < this.steps.length; i++)
      this.hideStep(this.steps[i]);
  },

  hideStep: function(step) {
    $('#' + step).hide();
    this.root.find('li a[rel=' + step + ']').removeClass('active');
  },

  showStep: function(step) {
    $('#' + step).show();
    this.root.find('li a[rel=' + step + ']').addClass('active');
    this.showButtons();
    this.saveStep();
  },

  activeStep: function() {
    return this.root.find('li a.active').attr('rel');
  },

  activeStepIndex: function() {
    return this.steps.indexOf(this.activeStep());
  },

  saveStep: function() {
    var form = this.root.parents('form');
    var action = form.attr('action').split('?')[0];

    form.attr('action', [action, this.activeStepIndex()].join('?step='));
  },

  showStartStep: function() {
    var href = window.location.href;
    var errors = $('fieldset div.field_with_errors');
    var activeStepIndex = href.split('?step=')[1];

    if (activeStepIndex && errors.length == 0) {
      this.showStep(this.steps[activeStepIndex]);
    } else {
      this.showStep(this.startStep());
    }
  },
}

$(function() {
  $('nav.tabbed-form').each( function() {
    if(!this.tabbedForm)
      this.tabbedForm = new TabbedForm(this);
  });
});
