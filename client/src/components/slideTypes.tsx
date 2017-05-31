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