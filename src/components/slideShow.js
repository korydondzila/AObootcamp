import React from 'react'
import './slideShow.css'

class Slide extends React.Component
{
	render(child)
	{
		return (
			<div className="slide">
				{child}
			</div>
		);
	}
}

class TitleSlide extends Slide
{
	constructor(props)
	{
		super();
		this.props = props;
	}

	render()
	{
		return super.render(<h1>{this.props.title}</h1>);
	}
}

class HeaderSlide extends Slide
{
	constructor(props)
	{
		super();
		this.props = props;
	}

	render()
	{
		return super.render([
			<h2>{this.props.header}</h2>,
			<p>{this.props.body}</p>
		]);
	}
}

class TwoColumnSlide extends Slide
{
	constructor(props)
	{
		super();
		this.props = props;
	}

	renderParagraphs()
	{
		var ps = [];
		this.props.body.forEach(function(element) {
			ps.push(<p>{element}</p>);
		}, this);
		return ps;
	}

	render()
	{
		const ps = this.renderParagraphs();
		return super.render([
			<h2>{this.props.header}</h2>,
			<div className="two-column">{ps}</div>
		]);
	}
}

function Button(props)
{
	return (
		<button className={props.type} onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class SlideShow extends React.Component
{
	constructor()
	{
		super();
		this.slides = [];
		this.slides.push(<TitleSlide title="Title Here"/>);
		this.slides.push(<HeaderSlide header="Some Header" body="Lorem ipsum dolor sit amet, ... Well we need some real content too. Otherwise this looks rather dull. Nulla ullamcorper diam arcu, ... And some more text to make this look like a paragragh. In libero diam, facilisis quis urna nec, ... By the way, fake Latin is not good fill text. It behaves differently from the texts you will really use. Sed varius et mi quis dictum. ... But I digress."/>);
		this.slides.push(
			<TwoColumnSlide header="Two Columns" body={[
				"Lorem ipsum dolor sit amet, ... Well we need some real content too. Otherwise this looks rather dull.",
				"Nulla ullamcorper diam arcu, ... And some more text to make this look like a paragragh.",
				"In libero diam, facilisis quis urna nec, ... By the way, fake Latin is not good fill text. It behaves differently from the texts you will really use.",
				"Sed varius et mi quis dictum. ... But I digress."
			]}/>
		);

		this.state = {
			currentSlide: 0,
		};
	}

	prevNextClick(type)
	{
		const current = this.state.currentSlide;
		if (type === "prev" && current > 0)
		{
			this.setState({
				currentSlide: current - 1
			});
		}
		else if (type === "next" && current < this.slides.length - 1)
		{
			this.setState({
				currentSlide: current + 1
			});
		}
	}

	render()
	{
		return (
			<div className="slide-show">
				{this.slides[this.state.currentSlide]}
				<Button 
					type="prev"
					value="Previous"
					onClick={() => this.prevNextClick("prev")}
				/>
				<Button 
					type="next"
					value="Next"
					onClick={() => this.prevNextClick("next")}
				/>
			</div>
		);
	}
}

export default SlideShow
