import Head from 'next/head'
import Image from 'next/image'
import React, { Component } from 'react'
import Header from '../components/header'
import styles from '../styles/GettingStarted.module.css'
import ChatGettingStarted from '../public/ChatGettingStarted.jpg'

export interface GettingStartedState {
}

export interface GettingStartedProps { }

/**
 * Class/Component for the getting started page
 * @component
 * @category Pages
 */
class GettingStarted extends Component<GettingStartedProps, GettingStartedState> {
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
          <Header pageInformation={"Getting Started"} showName={false} showExit={true} showLogout={false} />
        </header>

        <main>
          <div className={styles.wrapper}>
            <div className={styles.top}>
              <div className={styles.content}>
                <h1>GETTING STARTED</h1>
                <h2>Welcome to DEV-CHAT!</h2>
                <p>
                  DEV-CHAT is an online Messenger styled for (and by) computer scientists. <br/>
                  If you feel lost on this website don&apos;t worry, as you will be guided through it in the following paragraphs.
                </p>

                <h3>The chatroom</h3>
                <div className={styles.chatImage}>
                  <Image
                    priority
                    src={ChatGettingStarted}
                    alt="getting started with the chat"
                    objectFit='contain'
                    sizes='fitContent'
                    layout="fill"
                  />
                </div>
                <p>
                  The image above shows an exemplary chat room. <br />
                  These are the main components:
                </p>
                <ol>
                  <li>This is the logo of DEV-CHAT. By clicking on it you will be redirected to the main page.</li>
                  <li>This is the name of the room you are currently joined to.</li>
                  <li>This is your very own username.</li>
                  <li>This is where you can find our legal notice. Click on it if you are interested.</li>
                  <li>By clicking on the door icon in the upper right corner of the screen you leave the chat room and are redirected to the main page.</li>
                  <li>The messages of the chat room are displayed here.</li>
                  <li>The text &quot;Write a message...&quot; is enough indication for what is done here. (send by pressing enter)</li>
                </ol>

                <h3>Commands</h3>
                <h4>Normal Commands</h4>
                <p>
                  The DEV-CHAT has the option of using several commands.
                </p>
                <ul>
                  <li>
                    /msg<br/>
                    &quot;/msg &lt;User&gt; &lt;Direct message&gt;&quot; is used to whisper to another user.
                  </li>
                  <li>
                    /calc
                    <br/>
                    By typing &quot;/calc &lt;mathematical expression&gt;&quot; you can calculate your very own math homework. 
                    Just keep in mind, that this is no scientific calculator and can&apos;t solve e.g. factorials.
                  </li>
                  <li>
                    /report
                    <br/>
                    The report function is used to report a bug to our team. Just write plain text after &quot;/report&quot; and press enter to send
                    your problem to us.
                  </li>

                </ul>
                <h4>
                  Survey Commands
                </h4>
                <p>
                  There are 3 commands for surveys.
                </p>
                <ul>
                  <li>
                    /survey 
                    <br/>
                    &quot;/survey &lt;SurveyName&gt; &lt;&quot;Description&quot;&gt; &lt;ExpirationDate (DD.MM.YYYY-HH:MM)&gt; &lt;Option1&gt; &lt;Option2&gt; ... &lt;OptionN&gt;&quot;<br/>
                    For example: /survey Food &quot;Please Vote for your favorite food!&quot; 13.03.2022-13:10 Bananas Apples Peaches
                  </li>
                  <li>
                    /vote
                    <br/>
                    &quot;/vote &lt;surveyID&gt; &lt;voteOptionID&gt;&quot; is used to vote for an option of a survey.
                  </li>
                  <li>
                    /show 
                    <br/>
                    With &quot;/show&quot;, all currently available surveys in this chat room will be listed in the chat.
                  </li>
                </ul>

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
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
}
export default GettingStarted;
