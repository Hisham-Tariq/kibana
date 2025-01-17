/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { StepDefineRule } from './index';
import mockBrowserFields from './mock_browser_fields.json';

import { aggregatableFields } from '.';

jest.mock('../../../../common/lib/kibana');

test('aggregatableFields', function () {
  expect(aggregatableFields(mockBrowserFields)).toMatchSnapshot();
});

describe('StepDefineRule', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<StepDefineRule isReadOnlyView={false} isLoading={false} />);

    expect(wrapper.find('Form[data-test-subj="stepDefineRule"]')).toHaveLength(1);
  });
});
