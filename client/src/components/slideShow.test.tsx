import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SlideShow from './slideShow';
import {shallow} from 'enzyme';

it('checks that currentSlide is correct', () => {
      const wrapper = shallow(<SlideShow />);
      expect(wrapper.state().currentSlide).toEqual(0);
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SlideShow />, div);
});