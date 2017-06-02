import * as React from 'react';
import './slideTypes.css';

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

export class TitleSlide extends React.Component<{header:string;}, null>
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

export class HeaderSlide extends React.Component<{header:string; type:string; body:string[];}, null>
{
    renderParagraphs()
    {
        return this.props.body.map((paragraph: string) => {
            return <p>{paragraph}</p>;
        });
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