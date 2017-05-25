import * as React from 'react';
import './slideShow.css';

class Slide extends React.Component<{children?:any;}, null>
{
    render()
    {
        return (
            <div className="slide">
                {this.props.children}
            </div>
        );
    }
}

class TitleSlide extends React.Component<{title:string;}, null>
{
    render()
    {
        return (
            <Slide>
                <h1>{this.props.title}</h1>
            </Slide>
        );
    }
}

class HeaderSlide extends React.Component<{header:string; type:string; body:string[];}, null>
{
    renderParagraphs()
    {
        var ps = [];
        this.props.body.forEach(function(element: any) {
            ps.push(<p>{element}</p>);
            }, this);
        return ps;
    }

    render()
    {
        const ps = this.renderParagraphs();
        return (
            <Slide>
                <h2>{this.props.header}</h2>
                <div className={this.props.type}>
                    {ps}
                </div>
            </Slide>
        );
    }
}

function Button(props: any)
{
    return (
        <button className={props.type} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class SlideShow extends React.Component<null, {currentSlide:number}>
{
    slides: JSX.Element[] = [];

    constructor()
    {
        super();
        this.slides.push(<TitleSlide title="Title Here"/>);
        this.slides.push(<HeaderSlide header="Some Header" type=""
            body={[
                'Lorem ipsum dolor sit amet, ... Well we need some real content too. Otherwise this looks rather dull. Nulla ullamcorper diam arcu, ... And some more text to make this look like a paragragh. In libero diam, facilisis quis urna nec, ... By the way, fake Latin is not good fill text. It behaves differently from the texts you will really use. Sed varius et mi quis dictum. ... But I digress.'
            ]}/>
        );
        this.slides.push(
            <HeaderSlide header="Two Columns" type="two-column" body={[
                'Lorem ipsum dolor sit amet, ... Well we need some real content too. Otherwise this looks rather dull.',
                'Nulla ullamcorper diam arcu, ... And some more text to make this look like a paragragh.',
                'In libero diam, facilisis quis urna nec, ... By the way, fake Latin is not good fill text. It behaves differently from the texts you will really use.',
                'Sed varius et mi quis dictum. ... But I digress.'
            ]}/>
        );

        this.state = {
            currentSlide: 0,
        };
    }

    prevNextClick(type: string)
    {
        const current = this.state.currentSlide;
        if (type === 'prev')
        {
            this.setState({currentSlide: current - 1});
        }
        if (type === 'next')
        {
            this.setState({currentSlide: current + 1});
        }
    }

    render()
    {
        const curSlide = this.state.currentSlide;
        const slidesLen = this.slides.length;
        let prev = null;
        let next = null;
        if (curSlide > 0)
        {
            prev = <Button type="prev" value="Previous"
                        onClick={() => this.prevNextClick('prev')}
                    />;
        }

        if (curSlide < slidesLen - 1)
        {
            next = <Button type="next" value="Next"
                        onClick={() => this.prevNextClick('next')}
                    />;
        }

        return (
            <div className="slide-show">
                {this.slides[this.state.currentSlide]}
                {prev}
                {next}
            </div>
        );
    }
}

export default SlideShow;
