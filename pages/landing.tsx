import Head from 'next/head'
import Image from 'next/image'
import React, { Component } from 'react'
import Header from '../components/header'
import styles from '../styles/Impressum.module.css'
import ChatGettingStarted from '../public/ChatGettingStarted.jpg'

export interface LandingState {
}

export interface LandingProps { }

/**
 * Class/Component for the Landing Page
 * @component
 * @category Pages
 */
class Landing extends Component<LandingProps, LandingState> {
  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    return (
      <div>
        <Head>
          <title>GETTING STARTED</title>
          <meta name="GETTING STARTED" content="GETTING STARTED" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header>
          <Header pageInformation={"GETTING STARTED"} showName={false} showExit={true} showLogout={false} />
        </header>

        <main>
          <div className={styles.wrapper}>
            <div className={styles.top}>
              <div className={styles.content}>
                <h1>
                  GETTING STARTED
                </h1>
                <h2>Welcome to DEV-CHAT!</h2>
                <p>
                  DEV-CHAT is an online Messenger styled for (and by) computer scientists.
                </p>

                <p>
                  <br></br>
                  If you feel lost on this website don't worry, as you will be guided through it in the following paragraphs.
                </p>

                <div className={styles.image}>
                <Image
                  priority
                  src={ChatGettingStarted}
                  alt="getting started with the chat"
                  // objectFit='contain'
                  // sizes='fitContent'
                  // layout="fill"
                  width="100%"
                  height="100%"
                  layout="responsive"
                />
              </div>
                <p>
                  <br></br>
                  The image above shows an exemplary chat room. 
                  <ol>
                    <li>
                        This is the logo of DEV-CHAT. By clicking on it you will be redirected to the main page.
                    </li>
                    <li>
                        This is the name of the room you are currently joined to. 
                    </li>
                    <li>
                        This is your very own username.
                    </li>
                    <li>
                        This is where you can find our legal notice. Click on it if you are interested.
                    </li>
                    <li>
                        By clicking on the door icon in the upper right corner of the screen you leave the chat room and are redirected to the main page.
                    </li>
                    <li>
                        The messenges of the chat room are displayed here.
                    </li>
                    <li>
                        The text "Write a message..." is enough indication for what is done here. (send by pressing enter)
                    </li>
                  </ol>
                  <br></br>
                  <h4>
                    Commands
                  </h4>
                  <p>
                    <h5>
                      Normal Commands
                    </h5>
                    The DEV-CHAT has the option of using several commands.
                    <ul>
                      <li>
                        /msg
                        <br></br>
                        "/msg -User- -Direct message-" is used to whisper to another user.
                      </li>
                      <li>
                        /calc
                        <br></br>
                        By typing "/calc -mathematical expression-" you can calculate your very own math homework. Just keep in mind, that this is no
                        scientifical calculator and can't solve e.g. factorials.
                      </li>
                      <li>
                        /report 
                        <br></br>
                        The report function is used to report a bug to our team. Just write plain text after "/report" and press enter to send
                        your problem to us.
                      </li>
                      
                    </ul>
                    <h5>
                      Survey Commands
                    </h5>
                    There are 3 commands for surveys.
                    <ul>
                      <li>
                        /survey
                      </li>
                      <li>
                        /vote
                        <br></br>
                        "/vote -surveyID- -voteOptionID-" is used to vote for an option of a survey.
                      </li>
                      <li>
                        /show  
                        With "/show" you are shown all currently available surveys in this chat room.
                      </li>
                    </ul>
                  </p>
                </p>
                </div>
            </div>
            <div className={styles.right}>
              <div className={styles.image}>
                <Image
                  priority
                  src={"/logo.png"}
                  alt="DEV-CHAT Logo"
                  objectFit='contain'
                  sizes='fitContent'
                  layout="fill"
                  // width="100%"
                  // height="100%"
                  // layout="responsive"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
}
export default Landing;
