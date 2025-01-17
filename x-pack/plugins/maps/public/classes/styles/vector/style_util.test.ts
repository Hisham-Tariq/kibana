/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { isOnlySingleFeatureType, assignCategoriesToPalette, dynamicRound } from './style_util';
import { VECTOR_SHAPE_TYPE } from '../../../../common/constants';

describe('isOnlySingleFeatureType', () => {
  describe('source supports single feature type', () => {
    const supportedFeatures = [VECTOR_SHAPE_TYPE.POINT];
    const hasFeatureType = {
      [VECTOR_SHAPE_TYPE.POINT]: false,
      [VECTOR_SHAPE_TYPE.LINE]: false,
      [VECTOR_SHAPE_TYPE.POLYGON]: false,
    };

    test('Is only single feature type when only supported feature type is target feature type', () => {
      expect(
        isOnlySingleFeatureType(VECTOR_SHAPE_TYPE.POINT, supportedFeatures, hasFeatureType)
      ).toBe(true);
    });

    test('Is not single feature type when only supported feature type is not target feature type', () => {
      expect(
        isOnlySingleFeatureType(VECTOR_SHAPE_TYPE.LINE, supportedFeatures, hasFeatureType)
      ).toBe(false);
    });
  });

  describe('source supports multiple feature types', () => {
    const supportedFeatures = [
      VECTOR_SHAPE_TYPE.POINT,
      VECTOR_SHAPE_TYPE.LINE,
      VECTOR_SHAPE_TYPE.POLYGON,
    ];

    test('Is only single feature type when data only has target feature type', () => {
      const hasFeatureType = {
        [VECTOR_SHAPE_TYPE.POINT]: true,
        [VECTOR_SHAPE_TYPE.LINE]: false,
        [VECTOR_SHAPE_TYPE.POLYGON]: false,
      };
      expect(
        isOnlySingleFeatureType(VECTOR_SHAPE_TYPE.POINT, supportedFeatures, hasFeatureType)
      ).toBe(true);
    });

    test('Is not single feature type when data has multiple feature types', () => {
      const hasFeatureType = {
        [VECTOR_SHAPE_TYPE.POINT]: true,
        [VECTOR_SHAPE_TYPE.LINE]: true,
        [VECTOR_SHAPE_TYPE.POLYGON]: true,
      };
      expect(
        isOnlySingleFeatureType(VECTOR_SHAPE_TYPE.LINE, supportedFeatures, hasFeatureType)
      ).toBe(false);
    });

    test('Is not single feature type when data does not have target feature types', () => {
      const hasFeatureType = {
        [VECTOR_SHAPE_TYPE.POINT]: false,
        [VECTOR_SHAPE_TYPE.LINE]: true,
        [VECTOR_SHAPE_TYPE.POLYGON]: false,
      };
      expect(
        isOnlySingleFeatureType(VECTOR_SHAPE_TYPE.POINT, supportedFeatures, hasFeatureType)
      ).toBe(false);
    });
  });
});

describe('assignCategoriesToPalette', () => {
  test('Categories and icons have same length', () => {
    const categories = [
      { key: 'alpah', count: 1 },
      { key: 'bravo', count: 1 },
      { key: 'charlie', count: 1 },
      { key: 'delta', count: 1 },
    ];
    const paletteValues = ['circle', 'marker', 'triangle', 'square'];
    expect(assignCategoriesToPalette({ categories, paletteValues })).toEqual({
      stops: [
        {
          stop: 'alpah',
          style: 'circle',
          iconSource: 'MAKI',
        },
        {
          stop: 'bravo',
          style: 'marker',
          iconSource: 'MAKI',
        },
        {
          stop: 'charlie',
          style: 'triangle',
          iconSource: 'MAKI',
        },
      ],
      fallbackSymbolId: 'square',
    });
  });

  test('Should More categories than icon values', () => {
    const categories = [
      { key: 'alpah', count: 1 },
      { key: 'bravo', count: 1 },
      { key: 'charlie', count: 1 },
      { key: 'delta', count: 1 },
    ];
    const paletteValues = ['circle', 'square', 'triangle'];
    expect(assignCategoriesToPalette({ categories, paletteValues })).toEqual({
      stops: [
        {
          stop: 'alpah',
          style: 'circle',
          iconSource: 'MAKI',
        },
        {
          stop: 'bravo',
          style: 'square',
          iconSource: 'MAKI',
        },
      ],
      fallbackSymbolId: 'triangle',
    });
  });

  test('Less categories than icon values', () => {
    const categories = [
      { key: 'alpah', count: 1 },
      { key: 'bravo', count: 1 },
    ];
    const paletteValues = ['circle', 'triangle', 'marker', 'square', 'rectangle'];
    expect(assignCategoriesToPalette({ categories, paletteValues })).toEqual({
      stops: [
        {
          stop: 'alpah',
          style: 'circle',
          iconSource: 'MAKI',
        },
        {
          stop: 'bravo',
          style: 'triangle',
          iconSource: 'MAKI',
        },
      ],
      fallbackSymbolId: 'marker',
    });
  });
});

describe('dynamicRound', () => {
  test('Should truncate based on magnitude of number', () => {
    expect(dynamicRound(1000.1234)).toBe(1000);
    expect(dynamicRound(1.1234)).toBe(1.12);
    expect(dynamicRound(0.0012345678)).toBe(0.00123);
  });

  test('Should return argument when not a number', () => {
    expect(dynamicRound('foobar')).toBe('foobar');
  });
});
