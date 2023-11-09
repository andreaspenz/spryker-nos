/**
 * Copyright (c) Andreas Penz
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { expect, fixture, html } from '@open-wc/testing';
import { attributable, attribute } from '../src/attributable.js';

describe('initialization', () => {
    @attributable()
    class InitializeAttributeTest extends HTMLElement {
        @attribute({ type: Number })
        accessor testNumber = 123;

        @attribute({ type: Boolean })
        accessor testBool = false;

        @attribute({ type: String })
        accessor testString = 'foo';

        @attribute({ type: Array })
        accessor testArray = [1, 2, 3];

        @attribute({ type: Object })
        accessor testObject = { foo: 'bar' };

        #testGetterSetter = 'baz';

        testGetterSetterSetCount = 0;
        testGetterSetterGetCount = 0;

        @attribute({ type: String })
        set testGetterSetter(value: string) {
            this.testGetterSetterSetCount += 1;
            this.#testGetterSetter = value;
        }

        get testGetterSetter(): string {
            this.testGetterSetterGetCount += 1;
            return this.#testGetterSetter;
        }
    }

    window.customElements.define('initialize-attribute-test', InitializeAttributeTest);

    let instance: InitializeAttributeTest;

    it('does not alter field values from their initial value', async () => {
        instance = await fixture(html`<initialize-attribute-test />`);

        expect(instance).to.have.property('testNumber', 123);
        expect(instance).to.have.property('testBool', false);
        expect(instance).to.have.property('testString', 'foo');
        expect(instance).to.deep.property('testArray', [1, 2, 3]);
        expect(instance).to.deep.property('testObject', { foo: 'bar' });
        expect(instance).to.have.property('testGetterSetter', 'baz');
    });

    it('reflects the initial value as an attribute, if not present', async () => {
        instance = await fixture(html`<initialize-attribute-test />`);

        expect(instance).to.have.attribute('test-number', '123');
        expect(instance).to.not.have.attribute('test-bool');
        expect(instance).to.have.attribute('test-string', 'foo');
        expect(instance).to.have.attribute('test-array', '[1,2,3]');
        expect(instance).to.have.attribute('test-object', '{"foo":"bar"}');
        expect(instance).to.have.attribute('test-getter-setter', 'baz');
    });

    it('prioritises the value in the attribute over the property', async () => {
        instance = await fixture(
            html`<initialize-attribute-test
                test-number="456"
                test-bool
                test-string="bar"
                test-array="[4,5,6]"
                test-object="${JSON.stringify({ foo: 'baz' })}"
                test-getter-setter="bing"
            />`,
        );

        expect(instance).to.have.property('testNumber', 456);
        expect(instance).to.have.property('testBool', true);
        expect(instance).to.have.property('testString', 'bar');
        expect(instance).to.deep.property('testArray', [4, 5, 6]);
        expect(instance).to.deep.property('testObject', { foo: 'baz' });
        expect(instance).to.have.property('testGetterSetter', 'bing');
    });

    it('changes the property when the attribute changes', async () => {
        instance = await fixture(html`<initialize-attribute-test />`);

        instance.setAttribute('test-number', '456');
        expect(instance).to.have.property('testNumber', 456);

        instance.toggleAttribute('test-bool', true);
        expect(instance).to.have.property('testBool', true);

        instance.setAttribute('test-string', 'bar');
        expect(instance).to.have.property('testString', 'bar');

        instance.setAttribute('test-array', JSON.stringify([4, 5, 6]));
        expect(instance).to.deep.property('testArray', [4, 5, 6]);

        instance.setAttribute('test-object', JSON.stringify({ foo: 'baz' }));
        expect(instance).to.deep.property('testObject', { foo: 'baz' });

        instance.setAttribute('test-getter-setter', 'bing');
        expect(instance).to.have.property('testGetterSetter', 'bing');
    });

    it('changes the attribute when the property changes', async () => {
        instance = await fixture(html`<initialize-attribute-test />`);

        instance.testNumber = 789;
        expect(instance).to.have.attribute('test-number', '789');

        instance.testBool = true;
        expect(instance).to.have.attribute('test-bool');

        instance.testString = 'bar';
        expect(instance).to.have.attribute('test-string', 'bar');

        instance.testArray = [4, 5, 6];
        expect(instance).to.have.attribute('test-array', JSON.stringify([4, 5, 6]));

        instance.testObject = { foo: 'baz' };
        expect(instance).to.have.attribute('test-object', JSON.stringify({ foo: 'baz' }));

        instance.testGetterSetter = 'bing';
        expect(instance).to.have.attribute('test-getter-setter', 'bing');
    });

    it('calls underlying getter and setter', async () => {
        instance = await fixture(html`<initialize-attribute-test />`);
        expect(instance).to.have.property('testGetterSetterGetCount', 1);

        instance.testGetterSetter;
        expect(instance).to.have.property('testGetterSetterGetCount', 2);

        instance.testGetterSetter = 'bing';
        expect(instance).to.have.property('testGetterSetterSetCount', 1);

        instance.testGetterSetter = 'bong';
        expect(instance).to.have.property('testGetterSetterSetCount', 2);
    });
});

describe('boolean casting', () => {
    @attributable()
    class BooleanAttributeTest extends HTMLElement {
        @attribute({ type: Boolean })
        accessor testBool = false;
    }

    window.customElements.define('boolean-attribute-test', BooleanAttributeTest);

    let instance: BooleanAttributeTest;
    it('toggles boolean properties', async () => {
        instance = await fixture(html`<boolean-attribute-test />`);

        instance.setAttribute('test-bool', 'foo');
        expect(instance).to.have.property('testBool', true);

        instance.setAttribute('test-bool', 'bar');
        expect(instance).to.have.property('testBool', true);

        instance.setAttribute('test-bool', 'false');
        expect(instance).to.have.property('testBool', true);

        instance.removeAttribute('test-bool');
        expect(instance).to.have.property('testBool', false);

        instance.testBool = true;
        expect(instance).to.have.property('testBool', true);

        instance.testBool = false;
        expect(instance).to.have.property('testBool', false);
    });
});

describe('naming', () => {
    @attributable()
    class NamingAttributableTest extends HTMLElement {
        @attribute({ type: String })
        accessor fooBarBazBing = 'fooBarBazBing';

        @attribute({ type: String })
        accessor URLBar = 'URLBar';

        @attribute({ type: String })
        accessor ClipX = 'ClipX';
    }

    window.customElements.define('naming-attribute-test', NamingAttributableTest);

    let instance: NamingAttributableTest;
    it('converts property names to attribute names', async () => {
        instance = await fixture(html`<naming-attribute-test />`);

        instance.fooBarBazBing = 'bar';
        expect(instance.getAttributeNames()).to.include('foo-bar-baz-bing');
    });

    it('will parameterize acronyms', async () => {
        instance = await fixture(html`<naming-attribute-test />`);

        instance.URLBar = 'bar';
        expect(instance.getAttributeNames()).to.include('url-bar');
    });

    it('parameterizes cap suffixed names correctly', async () => {
        instance = await fixture(html`<naming-attribute-test />`);

        instance.ClipX = 'bar';
        expect(instance.getAttributeNames()).to.include('clip-x');
    });
});
