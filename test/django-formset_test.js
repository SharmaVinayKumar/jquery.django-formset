(function($) {
  var getTotalFormsValue;
  module("jQuery#djangoFormset", {
    setup: function() {
      var allFixtures;
      allFixtures = $("#qunit-fixture");
      this.fixtureIDontExist = allFixtures.find('#i-dont-exist');
      this.fixtureNoTemplate = allFixtures.find('#no-template');
      this.fixtureNoTotalForms = allFixtures.find('#no-total-forms');
      this.fixtureSimpleList = allFixtures.find('#simple-list');
      this.fixtureSimpleTable = allFixtures.find('#simple-table');
      this.fixtureDivWithForm = allFixtures.find('#div-with-form');
    }
  });
  test("throws when jQuery selection is empty", function() {
    throws((function() {
      return this.fixtureIDontExist.djangoFormset();
    }), /Empty selector./, "throws Error");
  });
  test("throws on missing TOTAL_FORMS", function() {
    throws((function() {
      return this.fixtureNoTotalForms.djangoFormset({
        prefix: 'no-total-forms'
      });
    }), /Management form field 'TOTAL_FORMS' not found for prefix no-total-forms/, "throws Error");
  });
  test("throws on missing template", function() {
    throws((function() {
      return this.fixtureNoTemplate.djangoFormset({
        prefix: 'no-template'
      });
    }), /Can\'t find template \(looking for .empty-form\)/, "throws Error");
  });
  test("can add form", function() {
    var formset;
    formset = this.fixtureSimpleList.djangoFormset({
      prefix: 'simple-list'
    });
    equal(this.fixtureSimpleList.find(".empty-form").length, 1, "there's exactly one template form");
    equal(this.fixtureSimpleList.find(":visible").length, 3, "and three visible templates");
    formset.addForm();
    equal(this.fixtureSimpleList.find(".empty-form").length, 1, "there's still exactly one template form");
    equal(this.fixtureSimpleList.find(":visible").length, 4, "but now four visible templates");
  });
  test("adds form at the end", function() {
    var formset, lastChild;
    formset = this.fixtureSimpleList.djangoFormset({
      prefix: 'simple-list'
    });
    equal(this.fixtureSimpleList.find(":visible:last-child").text(), "awesome test markup", "just checking current last form");
    formset.addForm();
    lastChild = this.fixtureSimpleList.find(":visible:last-child");
    equal(lastChild.text(), "template", "first new form was added at the end");
    lastChild.text("this is the form that was added first");
    equal(lastChild.text(), "this is the form that was added first", "the text of the newly added form was changed");
    formset.addForm();
    lastChild = this.fixtureSimpleList.find(":visible:last-child");
    equal(lastChild.text(), "template", "second new form was added at the end");
  });
  test("adds forms to tables as new rows", function() {
    var formset;
    formset = this.fixtureSimpleTable.djangoFormset({
      prefix: 'simple-table'
    });
    equal(this.fixtureSimpleTable.find('tbody > tr:visible').length, 0, "no forms there initially");
    formset.addForm();
    equal(this.fixtureSimpleTable.find('tbody > tr:visible').length, 1, "one row was added");
  });
  getTotalFormsValue = function(fixture, formset) {
    return parseInt(fixture.find("input[name='" + formset.prefix + "-TOTAL_FORMS']").val());
  };
  test("replaces form index template and updates TOTAL_FORMS", function() {
    var checkFormIndex, formset;
    checkFormIndex = function(fixture, formset, index) {
      equal(getTotalFormsValue(fixture, formset), index + 1, "after adding one form TOTAL_FORMS is " + (index + 1));
      equal(fixture.find('div:visible input[type="text"]').last().attr('name'), "object_set-" + index + "-text", "the text input's name has the id " + index + " in it");
      equal(fixture.find('div:visible select').last().attr('name'), "object_set-" + index + "-select", "the select's name has the id " + index + " in it");
      equal(fixture.find('div:visible textarea').last().attr('name'), "object_set-" + index + "-textarea", "the textarea's name has the id " + index + " in it");
      equal(fixture.find('div:visible input[type="checkbox"]').last().attr('name'), "object_set-" + index + "-check", "the checkbox input's name has the id " + index + " in it");
      return equal(fixture.find('div:visible label').last().attr('for'), fixture.find('div:visible input[type="checkbox"]').last().attr('id'), "the label's for attribute has the same value as the checkbox' id attribute");
    };
    formset = this.fixtureDivWithForm.djangoFormset({
      prefix: 'object_set'
    });
    equal(parseInt(this.fixtureDivWithForm.find('input[name="object_set-TOTAL_FORMS"]').val()), 0, "initially TOTAL_FORMS is 0");
    formset.addForm();
    checkFormIndex(this.fixtureDivWithForm, formset, 0);
    formset.addForm();
    checkFormIndex(this.fixtureDivWithForm, formset, 1);
  });
  test("deletes form that was added before", function() {
    var formset;
    formset = this.fixtureDivWithForm.djangoFormset({
      prefix: 'object_set'
    });
    formset.addForm();
    equal(getTotalFormsValue(this.fixtureDivWithForm, formset), 1, "TOTAL_FORMS is 1 now");
    formset.deleteForm(0);
    equal(this.fixtureDivWithForm.children('div:visible').length, 0, "the added form was deleted again");
    equal(getTotalFormsValue(this.fixtureDivWithForm, formset), 0, "TOTAL_FORMS is back to 0 again");
  });
})(jQuery);

//# sourceMappingURL=django-formset_test.js.map
