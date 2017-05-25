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

class TitleSlide extends React.Component<{header:string;}, null>
{
    render()
    {
        return (
            <Slide>
                <h1>{this.props.header}</h1>
            </Slide>
        );
    }
}

class HeaderSlide extends React.Component<{header:string; type:string; body:string[];}, null>
{
    renderParagraphs()
    {
        let ps: JSX.Element[] = [];
        this.props.body.forEach(function(element: any) {
            ps.push(<p>{element}</p>);
            });
        return ps;
    }

    render()
    {
        return (
            <Slide>
                <h2>{this.props.header}</h2>
                <div className={this.props.type}>
                    {this.renderParagraphs()}
                </div>
            </Slide>
        );
    }
}

function NavButton(props: any)
{
    return (
        <button className="nav-button" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

interface NavProps
{
    slides: string[];
    viewed: boolean[];
    onClick: (i) => any;
}

class NavMenu extends React.Component<NavProps, null>
{
    renderSlides()
    {
        let listSlides: JSX.Element[] = [];
        for (let i: number = 0; i < this.props.slides.length; i++)
        {
            if (this.props.viewed[i])
            {
                listSlides.push(
                    <li className="checked" key={i}>
                        <NavButton value={this.props.slides[i]} onClick={() => this.props.onClick(i)} />
                    </li>
                );
            }
            else
            {
                listSlides.push(
                    <li className="unchecked" key={i}>
                        <NavButton value={this.props.slides[i]} onClick={() => this.props.onClick(i)} />
                    </li>
                );
            }
        }
        return listSlides;
    }

    render()
    {
        return (
            <div className="nav-menu">
                <h3>Overview</h3>
                <ul className="nav-list">
                    {this.renderSlides()}
                </ul>
            </div>
        );
    }
}

function PrevNextButton(props: any)
{
    return (
        <button className={props.type} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

interface SlideShowState
{
    currentSlide: number;
    slidesViewed: boolean[];
}

class SlideShow extends React.Component<null, SlideShowState>
{
    slides: JSX.Element[] = [];

    constructor()
    {
        super();
        this.slides.push(<TitleSlide header="Title Here"/>);
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

        let viewed: boolean[] = [];
        for (let i: number = 0; i < this.slides.length; i++)
        {
            if (i)
            {
                viewed.push(false);
            }
            else
            {
                viewed.push(true);
            }
        }

        this.state = {
            currentSlide: 0,
            slidesViewed: viewed,
        };
    }

    prevNextClick(type: string)
    {
        const current = this.state.currentSlide;
        const viewed = this.state.slidesViewed.slice();
        if (type === 'prev')
        {
            viewed[current - 1] = true;
            this.setState({
                currentSlide: current - 1,
                slidesViewed: viewed,
            });
        }
        if (type === 'next')
        {
            viewed[current + 1] = true;
            this.setState({
                currentSlide: current + 1,
                slidesViewed: viewed,
            });
        }
    }

    navClick(i)
    {
        const viewed = this.state.slidesViewed.slice();
        viewed[i] = true;
        this.setState({
                currentSlide: i,
                slidesViewed: viewed,
        });
    }

    slideNames()
    {
        let names: string[] = [];
        this.slides.forEach(function(element: JSX.Element) {
            names.push(element.props.header);
        });

        return names;
    }

    render()
    {
        const curSlide = this.state.currentSlide;
        const slidesLen = this.slides.length;
        let prev = null;
        let next = null;
        if (curSlide > 0)
        {
            prev = <PrevNextButton type="prev" value="Previous"
                        onClick={() => this.prevNextClick('prev')}
                    />;
        }

        if (curSlide < slidesLen - 1)
        {
            next = <PrevNextButton type="next" value="Next"
                        onClick={() => this.prevNextClick('next')}
                    />;
        }

        return (
            <div className="slide-show">
                <NavMenu slides={this.slideNames()} viewed={this.state.slidesViewed}
                    onClick={(i) => this.navClick(i)}/>
                {this.slides[this.state.currentSlide]}
                {prev}
                {next}
            </div>
        );
    }
}

export default SlideShow;
