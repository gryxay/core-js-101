/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class CssSelectorBuilder {
  constructor() {
    this.selector = '';
    this.elementAdded = false;
    this.idAdded = false;
    this.classAdded = false;
    this.attributeAdded = false;
    this.pseudoClassAdded = false;
    this.pseudoElementAdded = false;
    this.errors = {
      duplicate: 'Element, id and pseudo-element should not occur more then one time inside the selector',
      order: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
    };
  }

  stringify() {
    return this.selector;
  }

  element(value) {
    if (this.elementAdded) throw new Error(this.errors.duplicate);
    if (this.idAdded) throw new Error(this.errors.order);
    this.elementAdded = true;
    this.selector += value;
    return this;
  }

  id(value) {
    if (this.idAdded) throw new Error(this.errors.duplicate);
    if (this.classAdded || this.pseudoElementAdded) throw new Error(this.errors.order);
    this.idAdded = true;
    this.selector += `#${value}`;
    return this;
  }

  class(value) {
    if (this.attrAdded) throw new Error(this.errors.order);
    this.classAdded = true;
    this.selector += `.${value}`;
    return this;
  }

  attr(value) {
    if (this.pseudoClassAdded) throw new Error(this.errors.order);
    this.attrAdded = true;
    this.selector += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    this.pseudoClassAdded = true;
    if (this.pseudoElementAdded) throw new Error(this.errors.order);
    this.selector += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.pseudoElementAdded) throw new Error(this.errors.duplicate);
    this.pseudoElementAdded = true;
    this.selector += `::${value}`;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.selector = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  }
}

const cssSelectorBuilder = {
  element(value) {
    const builder = new CssSelectorBuilder();
    builder.element(value);
    return builder;
  },

  id(value) {
    const builder = new CssSelectorBuilder();
    builder.id(value);
    return builder;
  },

  class(value) {
    const builder = new CssSelectorBuilder();
    builder.class(value);
    return builder;
  },

  attr(value) {
    const builder = new CssSelectorBuilder();
    builder.attr(value);
    return builder;
  },

  pseudoClass(value) {
    const builder = new CssSelectorBuilder();
    builder.pseudoClass(value);
    return builder;
  },

  pseudoElement(value) {
    const builder = new CssSelectorBuilder();
    builder.pseudoElement(value);
    return builder;
  },

  combine(selector1, combinator, selector2) {
    const builder = new CssSelectorBuilder();
    builder.combine(selector1, combinator, selector2);
    return builder;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
