import * as React from 'react';
import Client from '../client';
import * as ReactModal from 'react-modal';
import './slideShow.css';
import {TitleSlide, HeaderSlide} from './slideTypes';

window.onclick = function(e: any)
{
    if (!e.target.matches('.dropbtn'))
    {
        let drpdwn: HTMLElement = document.getElementById('file_dropdown');
        drpdwn.style.display = "none";
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

interface MainMenuProps
{
    onClickOpen: () => any;
}

class MainMenu extends React.Component<MainMenuProps, null>
{
    dropdown (id: string)
    {
        let drpdwn: HTMLElement = document.getElementById(id);
        drpdwn.style.display = 'flex';
        drpdwn.style.flexDirection = 'column';
        drpdwn.style.alignItems = 'center';
    }

    render()
    {
        return (
            <div className="main-menu">
                <div className="dropdown">
                    <Button type="dropbtn" value="File" 
                        onClick={() => this.dropdown('file_dropdown')}/>
                    <div id="file_dropdown" className="file-content">
                        <Button type="menu-button" value="Open" 
                            onClick={() => this.props.onClickOpen()}/>
                        <Button type="menu-button" value="Save"/>
                    </div>
                </div>
                <Button type="menu-button" value="Edit"/>
            </div>
        );
    }
}

interface DialogProps
{
    isOpen: boolean;
    onClick: () => any;
}

class OpenDialog extends React.Component<DialogProps, null>
{
    slideshows: any[] = [];

    listSlideshows()
    {
        if (this.slideshows.length === 0)
        {
            Client.search(
                'SELECT * FROM `ao_slideshows`;',
                (slideShows: any) => {
                    this.slideshows = slideShows.slice();
                }
            );
        }

        let temp: JSX.Element[] = [];
        this.slideshows.map((slideshow, id) => {
            let file: string = slideshow.file;
            temp.push(
                <li key={id}>
                    <Button type="nav-button" value={file}/>
                </li>
            );
        });

        return temp;
    }

    render()
    {
        return (
            <ReactModal isOpen={this.props.isOpen} contentLabel="Open Dialog" 
                shouldCloseOnOverlayClick={true} onRequestClose={this.props.onClick()} 
                role="dialog">
                <ul>
                    {this.listSlideshows()}
                </ul>
                <Button type="nav-button" value="Close"
                    onClick={() => this.props.onClick()}/>
            </ReactModal>
        );
    }
}

interface NavProps
{
    slides: string[];
    viewed: boolean[];
    onClick: (i: number) => any;
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
                        <Button type="nav-button" 
                            value={this.props.slides[i]} 
                            onClick={() => this.props.onClick(i)} />
                    </li>
                );
            }
            else
            {
                listSlides.push(
                    <li className="unchecked" key={i}>
                        <Button type="nav-button" 
                            value={this.props.slides[i]} 
                            onClick={() => this.props.onClick(i)} />
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

interface SlideShowState
{
    currentSlide: number;
    slidesViewed: boolean[];
    imgs: string[];
    showOpenDialog: boolean;
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
            imgs: [],
            showOpenDialog: false,
        };

        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
    }

    handleOpenDialog()
    {
        this.setState({ showOpenDialog: true })
    }

    handleCloseDialog()
    {
        this.setState({ showOpenDialog: false })
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

    navClick(i: number)
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
                <OpenDialog isOpen={this.state.showOpenDialog} 
                    onClick={() => this.handleCloseDialog()}/>
                <MainMenu onClickOpen={() => this.handleOpenDialog()}/>
                <NavMenu slides={this.slideNames()} viewed={this.state.slidesViewed}
                    onClick={(i) => this.navClick(i)}/>
                {this.slides[this.state.currentSlide]}
                {prev}
                {next}
                <div className="imgs">
                    <p>
                    {this.state.imgs.map((id, index) => {
                        return id + ', ';
                    })}
                    </p>
                </div>
            </div>
        );
    }
}

export default SlideShow;
