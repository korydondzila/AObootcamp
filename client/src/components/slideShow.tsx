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
        drpdwn.style.display = 'none';
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
    onSlideClick: (file: string) => any;
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

        return this.slideshows.map((slideshow, id) => {
            return (
                <tr className="slideshow-row" key={id} 
                    onClick={() => this.props.onSlideClick(slideshow.file)}>
                    <th>{slideshow.file}</th>
                    <th>{slideshow.date_modified}</th>
                    <th>{slideshow.date_creation}</th>
                </tr>
            );
        });
    }

    render()
    {
        return (
            <ReactModal className="openDialog" overlayClassName="openDialogOverlay" 
                isOpen={this.props.isOpen} contentLabel="Open Dialog" 
                shouldCloseOnOverlayClick={true} onRequestClose={this.props.onClick} 
                role="dialog">
                <div className="slideShow-list">
                    <table>
                        <tr>
                            <th>Slideshow</th>
                            <th>Modified Date</th>
                            <th>Creation Date</th>
                        </tr>
                        {this.listSlideshows()}
                    </table>
                </div>
                <Button type="dialog-close-button" value="Close"
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
        return this.props.slides.map((slide, i) => {
            if (this.props.viewed[i])
            {
                return (
                    <li className="checked" key={i}>
                        <Button type="nav-button" value={this.props.slides[i]} 
                            onClick={() => this.props.onClick(i)} />
                    </li>
                );
            }
            else
            {
                return (
                    <li className="unchecked" key={i}>
                        <Button type="nav-button" value={this.props.slides[i]} 
                            onClick={() => this.props.onClick(i)} />
                    </li>
                );
            }
        });
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
    slides: JSX.Element[];
    currentSlide: number;
    slidesViewed: boolean[];
    showOpenDialog: boolean;
}

class SlideShow extends React.Component<null, SlideShowState>
{
    constructor()
    {
        super();
        let slides: JSX.Element[] = [];
        slides.push(<TitleSlide header="Title Here"/>);
        slides.push(<HeaderSlide header="Some Header" type=""
            body={[
                'Lorem ipsum dolor sit amet, ... Well we need some real content too. Otherwise this looks rather dull. Nulla ullamcorper diam arcu, ... And some more text to make this look like a paragragh. In libero diam, facilisis quis urna nec, ... By the way, fake Latin is not good fill text. It behaves differently from the texts you will really use. Sed varius et mi quis dictum. ... But I digress.'
            ]}/>
        );
        slides.push(
            <HeaderSlide header="Two Columns" type="two-column" body={[
                'Lorem ipsum dolor sit amet, ... Well we need some real content too. Otherwise this looks rather dull.',
                'Nulla ullamcorper diam arcu, ... And some more text to make this look like a paragragh.',
                'In libero diam, facilisis quis urna nec, ... By the way, fake Latin is not good fill text. It behaves differently from the texts you will really use.',
                'Sed varius et mi quis dictum. ... But I digress.'
            ]}/>
        );

        let viewed: boolean[] = [];
        for (let i: number = 0; i < slides.length; i++)
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
            slides: slides,
            currentSlide: 0,
            slidesViewed: viewed,
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

    handleSlideClick(file: string)
    {
        let slides: JSX.Element[] = [];
        Client.search(
            'SELECT s.data FROM `ao_slides` s ' +
            '    JOIN `ao_slideshows` AS h ON s.slideshow_id = h.id ' +
            'WHERE h.file = "' + file + '" ' +
            'ORDER BY s.index ASC;',
            (slideShow: any) => {
                slideShow.map((slide) => {
                    let data: any = JSON.parse(slide.data);
                    switch(data.type)
                    {
                        case 'TitleSlide':
                            slides.push(<TitleSlide header={data.header}/>);
                            break;
                        case 'HeaderSlide':
                            slides.push(<HeaderSlide header={data.header} type={data.subType} body={data.body}/>);
                            break;
                        default:
                            break;
                    }
                });

                let viewed: boolean[] = [];
                for (let i: number = 0; i < slides.length; i++)
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

                this.setState({
                    slides: slides,
                    currentSlide: 0,
                    slidesViewed: viewed,
                    showOpenDialog: false,
                });
            }
        );
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
        this.state.slides.forEach(function(element: JSX.Element) {
            names.push(element.props.header);
        });

        return names;
    }

    render()
    {
        const curSlide = this.state.currentSlide;
        const slidesLen = this.state.slides.length;
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
                    onClick={() => this.handleCloseDialog()}
                    onSlideClick={(file) => this.handleSlideClick(file)}/>
                <MainMenu onClickOpen={() => this.handleOpenDialog()}/>
                <NavMenu slides={this.slideNames()} viewed={this.state.slidesViewed}
                    onClick={(i) => this.navClick(i)}/>
                {this.state.slides[this.state.currentSlide]}
                {prev}
                {next}
            </div>
        );
    }
}

export default SlideShow;
