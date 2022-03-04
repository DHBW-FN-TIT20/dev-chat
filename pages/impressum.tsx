import Head from 'next/head'
import Image from 'next/image'
import React, { Component } from 'react'
import Header from '../components/header'
import styles from '../styles/Impressum.module.css'

export interface ImpressumState {
}

export interface ImpressumProps { }

/**
 * Class/Component for the Impressum Page
 * @component
 * @category Pages
 */
class Impressum extends Component<ImpressumProps, ImpressumState> {
  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    return (
      <div>
        <Head>
          <title>Rechtliches</title>
          <meta name="Rechtliches" content="Rechtliches" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header>
          <Header pageInformation={"Rechtliches"} showName={false} showExit={true} showLogout={false} />
        </header>

        <main>
          <div className={styles.wrapper}>
            <div className={styles.top}>
              <div className={styles.content}>
                <h1>
                  Verantwortlich
                </h1>
                <p>
                  Henry Schuler
                </p>
                <br />
                <h1>
                  Team
                </h1>
                <p>
                  Nico Bayer <br />
                  Johannes Brandenburger <br />
                  Lukas Braun <br />
                  Jan Brutscher <br />
                  Phillipp Patzelt <br />
                </p>
                <br></br>
                <h1>
                  Kontakt
                </h1>
                <p>
                  Henry Schuler <br />
                  Kastellstraße 69/1 <br />
                  88316 Isny <br />
                  <br />
                  Tel: +49 163 7292914 <br />
                  E-Mail: devchat.contact@gmail.com <br />
                </p>
                <br></br>
                <h1>Datenschutzerklärung</h1>

                <p>Verantwortlicher im Sinne der Datenschutzgesetze, insbesondere der EU-Datenschutzgrundverordnung (DSGVO), ist:</p>

                <p>
                  <br /><br />
                  Henry Schuler <br />
                  Kastellstraße 69/1 <br />
                  88316 Isny <br />
                  <br />
                  Tel: +49 163 7292914 <br />
                  E-Mail: devchat.contact@gmail.com <br />
                </p>

                <h2>Ihre Betroffenenrechte</h2>

                <p>Unter den angegebenen Kontaktdaten unseres Datenschutzbeauftragten können Sie jederzeit folgende Rechte ausüben:</p>

                <ul>

                  <li>Auskunft über Ihre bei uns gespeicherten Daten und deren Verarbeitung (Art. 15 DSGVO),</li>

                  <li>Berichtigung unrichtiger personenbezogener Daten (Art. 16 DSGVO),</li>

                  <li>Löschung Ihrer bei uns gespeicherten Daten (Art. 17 DSGVO),</li>

                  <li>Einschränkung der Datenverarbeitung, sofern wir Ihre Daten aufgrund gesetzlicher Pflichten noch nicht löschen dürfen (Art. 18 DSGVO),</li>

                  <li>Widerspruch gegen die Verarbeitung Ihrer Daten bei uns (Art. 21 DSGVO) und</li>

                  <li>Datenübertragbarkeit, sofern Sie in die Datenverarbeitung eingewilligt haben oder einen Vertrag mit uns abgeschlossen haben (Art. 20 DSGVO).</li>

                </ul>

                <p>Sofern Sie uns eine Einwilligung erteilt haben, können Sie diese jederzeit mit Wirkung für die Zukunft widerrufen.</p>

                <p>Sie können sich jederzeit mit einer Beschwerde an eine Aufsichtsbehörde wenden, z. B. an die zuständige Aufsichtsbehörde des Bundeslands Ihres Wohnsitzes oder an die für uns als verantwortliche Stelle zuständige Behörde.</p>

                <p>Eine Liste der Aufsichtsbehörden (für den nichtöffentlichen Bereich) mit Anschrift finden Sie unter: <a href="https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html">https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html</a>.</p>

                <p></p><h2>Erfassung allgemeiner Informationen beim Besuch unserer Website</h2>

                <h3>Art und Zweck der Verarbeitung:</h3>

                <p>Wenn Sie auf unsere Website zugreifen, d.h., wenn Sie sich nicht registrieren oder anderweitig Informationen übermitteln, werden automatisch Informationen allgemeiner Natur erfasst. Diese Informationen (Server-Logfiles) beinhalten etwa die Art des Webbrowsers, das verwendete Betriebssystem, den Domainnamen Ihres Internet-Service-Providers, Ihre IP-Adresse und ähnliches. </p>

                <p>Sie werden insbesondere zu folgenden Zwecken verarbeitet:</p>

                <ul>

                  <li>Sicherstellung eines problemlosen Verbindungsaufbaus der Website,</li>

                  <li>Sicherstellung einer reibungslosen Nutzung unserer Website,</li>

                  <li>Auswertung der Systemsicherheit und -stabilität sowie</li>

                  <li>zur Optimierung unserer Website.</li>

                </ul>

                <p>Wir verwenden Ihre Daten nicht, um Rückschlüsse auf Ihre Person zu ziehen. Informationen dieser Art werden von uns ggfs. anonymisiert statistisch ausgewertet, um unseren Internetauftritt und die dahinterstehende Technik zu optimieren. </p>

                <h3>Rechtsgrundlage und berechtigtes Interesse:</h3>

                <p>Die Verarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. f DSGVO auf Basis unseres berechtigten Interesses an der Verbesserung der Stabilität und Funktionalität unserer Website.</p>

                <h3>Empfänger:</h3>

                <p>Empfänger der Daten sind ggf. technische Dienstleister, die für den Betrieb und die Wartung unserer Webseite als Auftragsverarbeiter tätig werden.</p>

                <p></p><h3>Speicherdauer:</h3>

                <p>Die Daten werden gelöscht, sobald diese für den Zweck der Erhebung nicht mehr erforderlich sind. Dies ist für die Daten, die der Bereitstellung der Website dienen, grundsätzlich der Fall, wenn die jeweilige Sitzung beendet ist. </p>

                <p></p><h3>Bereitstellung vorgeschrieben oder erforderlich:</h3>

                <p>Die Bereitstellung der vorgenannten personenbezogenen Daten ist weder gesetzlich noch vertraglich vorgeschrieben. Ohne die IP-Adresse ist jedoch der Dienst und die Funktionsfähigkeit unserer Website nicht gewährleistet. Zudem können einzelne Dienste und Services nicht verfügbar oder eingeschränkt sein. Aus diesem Grund ist ein Widerspruch ausgeschlossen. </p>

                <p></p><h2>Cookies</h2>

                <p>Wie viele andere Webseiten verwenden wir auch so genannte „Cookies“. Bei Cookies handelt es sich um kleine Textdateien, die auf Ihrem Endgerät (Laptop, Tablet, Smartphone o.ä.) gespeichert werden, wenn Sie unsere Webseite besuchen. </p>

                <p>Sie können Sie einzelne Cookies oder den gesamten Cookie-Bestand löschen. Darüber hinaus erhalten Sie Informationen und Anleitungen, wie diese Cookies gelöscht oder deren Speicherung vorab blockiert werden können. Je nach Anbieter Ihres Browsers finden Sie die notwendigen Informationen unter den nachfolgenden Links:</p>

                <ul>

                  <li>Mozilla Firefox: <a href="https://support.mozilla.org/de/kb/cookies-loeschen-daten-von-websites-entfernen" >https://support.mozilla.org/de/kb/cookies-loeschen-daten-von-websites-entfernen</a></li>

                  <li>Internet Explorer: <a href="https://support.microsoft.com/de-de/help/17442/windows-internet-explorer-delete-manage-cookies" >https://support.microsoft.com/de-de/help/17442/windows-internet-explorer-delete-manage-cookies</a></li>

                  <li>Google Chrome: <a href="https://support.google.com/accounts/answer/61416?hl=de" >https://support.google.com/accounts/answer/61416?hl=de</a></li>

                  <li>Opera: <a href="http://www.opera.com/de/help" >http://www.opera.com/de/help</a></li>

                  <li>Safari: <a href="https://support.apple.com/kb/PH17191?locale=de_DE&viewlocale=de_DE" >https://support.apple.com/kb/PH17191?locale=de_DE&viewlocale=de_DE</a></li>

                </ul>

                <h3>Speicherdauer und eingesetzte Cookies:</h3>

                <p>Soweit Sie uns durch Ihre Browsereinstellungen oder Zustimmung die Verwendung von Cookies erlauben, können folgende Cookies auf unseren Webseiten zum Einsatz kommen:</p>

                <p><br /><br />Benutzername - dieser wird bis zum Logout abgespeichert</p>

                <h2>Technisch notwendige Cookies </h2>

                <h3>Art und Zweck der Verarbeitung: </h3>

                <p>Wir setzen Cookies ein, um unsere Website nutzerfreundlicher zu gestalten. Einige Elemente unserer Internetseite erfordern es, dass der aufrufende Browser auch nach einem Seitenwechsel identifiziert werden kann.</p>

                <p>Der Zweck der Verwendung technisch notwendiger Cookies ist, die Nutzung von Websites für die Nutzer zu vereinfachen. Einige Funktionen unserer Internetseite können ohne den Einsatz von Cookies nicht angeboten werden. Für diese ist es erforderlich, dass der Browser auch nach einem Seitenwechsel wiedererkannt wird.</p>

                <p>Für folgende Anwendungen benötigen wir Cookies:</p>

                <p>Merken von Suchbegriffen</p>

                <h3>Rechtsgrundlage und berechtigtes Interesse: </h3>

                <p>Die Verarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. f DSGVO auf Basis unseres berechtigten Interesses an einer nutzerfreundlichen Gestaltung unserer Website.</p>

                <h3>Empfänger: </h3>

                <p>Empfänger der Daten sind ggf. technische Dienstleister, die für den Betrieb und die Wartung unserer Website als Auftragsverarbeiter tätig werden.</p>

                <p></p><h3>Bereitstellung vorgeschrieben oder erforderlich:</h3>

                <p>Die Bereitstellung der vorgenannten personenbezogenen Daten ist weder gesetzlich noch vertraglich vorgeschrieben. Ohne diese Daten ist jedoch der Dienst und die Funktionsfähigkeit unserer Website nicht gewährleistet. Zudem können einzelne Dienste und Services nicht verfügbar oder eingeschränkt sein.</p>

                <h3>Widerspruch</h3>

                <p>Lesen Sie dazu die Informationen über Ihr Widerspruchsrecht nach Art. 21 DSGVO weiter unten.</p>

                <p></p><h2>Registrierung auf unserer Website</h2>

                <h3>Art und Zweck der Verarbeitung:</h3>

                <p>Für die Registrierung auf unserer Website benötigen wir einige personenbezogene Daten, die über eine Eingabemaske an uns übermittelt werden. </p>

                <p>Zum Zeitpunkt der Registrierung werden zusätzlich folgende Daten erhoben: Keine.</p>

                <p></p><p>Ihre Registrierung ist für das Bereithalten bestimmter Inhalte und Leistungen auf unserer Website erforderlich.</p>

                <h3>Rechtsgrundlage:</h3>

                <p>Die Verarbeitung der bei der Registrierung eingegebenen Daten erfolgt auf Grundlage einer Einwilligung des Nutzers (Art. 6 Abs. 1 lit. a DSGVO).</p>

                <h3>Empfänger:</h3>

                <p>Empfänger der Daten sind ggf. technische Dienstleister, die für den Betrieb und die Wartung unserer Website als Auftragsverarbeiter tätig werden.</p>

                <p></p><h3>Speicherdauer:</h3>

                <p>Daten werden in diesem Zusammenhang nur verarbeitet, solange die entsprechende Einwilligung vorliegt. </p>

                <h3>Bereitstellung vorgeschrieben oder erforderlich:</h3>

                <p>Die Bereitstellung Ihrer personenbezogenen Daten erfolgt freiwillig, allein auf Basis Ihrer Einwilligung. Ohne die Bereitstellung Ihrer personenbezogenen Daten können wir Ihnen keinen Zugang auf unsere angebotenen Inhalte gewähren. </p>

                <p></p><h2>Kommentarfunktion</h2>

                <h3>Art und Zweck der Verarbeitung:</h3>

                <p>Wenn Nutzer Kommentare auf unserer Website hinterlassen, werden neben diesen Angaben auch der Zeitpunkt ihrer Erstellung und der zuvor durch den Websitebesucher gewählte Nutzername gespeichert. Dies dient unserer Sicherheit, da wir für widerrechtliche Inhalte auf unserer Webseite belangt werden können, auch wenn diese durch Benutzer erstellt wurden.</p>

                <h3>Rechtsgrundlage:</h3>

                <p>Die Verarbeitung der als Kommentar eingegebenen Daten erfolgt auf der Grundlage eines berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO).</p>

                <p>Durch Bereitstellung der Kommentarfunktion möchten wir Ihnen eine unkomplizierte Interaktion ermöglichen. Ihre gemachten Angaben werden zum Zwecke der Bearbeitung der Anfrage sowie für mögliche Anschlussfragen gespeichert.</p>

                <h3>Empfänger:</h3>

                <p>Empfänger der Daten sind ggf. Auftragsverarbeiter.</p>

                <p></p><h3>Speicherdauer:</h3>

                <p>Die Daten werden gelöscht, sobald diese für den Zweck der Erhebung nicht mehr erforderlich sind. Dies ist grundsätzlich der Fall, wenn die Kommunikation mit dem Nutzer abgeschlossen ist und das Unternehmen den Umständen entnehmen kann, dass der betroffene Sachverhalt abschließend geklärt ist. Wir behalten uns die Löschung ohne Angaben von Gründen und ohne vorherige oder nachträgliche Information vor.</p>

                <p>Außerdem können Sie Ihren Kommentar jederzeit durch uns löschen lassen. Schreiben Sie dafür bitte eine E-Mail an den unten aufgeführten Datenschutzbeauftragten bzw. die für den Datenschutz zuständige Person und übermitteln den Link zu Ihrem Kommentar sowie zu Identifikationszwecken die bei der Erstellung des Kommentars verwendete E-Mail-Adresse.</p>

                <h3>Bereitstellung vorgeschrieben oder erforderlich:</h3>

                <p>Die Bereitstellung Ihrer personenbezogenen Daten erfolgt freiwillig. Ohne die Bereitstellung Ihrer personenbezogenen Daten können wir Ihnen keinen Zugang zu unserer Kommentarfunktion gewähren.</p>

                <p></p><h2>Kontaktformular</h2>

                <p>Wir stellen kein Kontaktformular auf dieser Webseite bereit. Falls sie dennoch wünschen mit uns Kontakt aufzunehmen, um z. B. Fragen zu stellen oder uns über Änderung/Löschung Ihrer Daten zu informieren, nutzen sie bitte die im Impressum angegebenen Kontaktdaten.</p>

                <h2>Information über Ihr Widerspruchsrecht nach Art. 21 DSGVO</h2>

                <h3>Einzelfallbezogenes Widerspruchsrecht</h3>

                <p>Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten, die aufgrund Art. 6 Abs. 1 lit. f DSGVO (Datenverarbeitung auf der Grundlage einer Interessenabwägung) erfolgt, Widerspruch einzulegen; dies gilt auch für ein auf diese Bestimmung gestütztes Profiling im Sinne von Art. 4 Nr. 4 DSGVO.</p>

                <p>Legen Sie Widerspruch ein, werden wir Ihre personenbezogenen Daten nicht mehr verarbeiten, es sei denn, wir können zwingende schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.</p>

                <h3>Empfänger eines Widerspruchs</h3>

                <p>
                  Henry Schuler <br />
                  Kastellstraße 69/1 <br />
                  88316 Isny <br />
                  <br />
                  Tel: +49 163 7292914 <br />
                  E-Mail: devchat.contact@gmail.com <br />
                </p>

                <h2>Änderung unserer Datenschutzbestimmungen</h2>

                <p>Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen, z.B. bei der Einführung neuer Services. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.</p>

                <h2>Fragen an den Datenschutzbeauftragten</h2>

                <p>Wenn Sie Fragen zum Datenschutz haben, schreiben Sie uns bitte eine E-Mail oder wenden Sie sich direkt an die für den Datenschutz verantwortliche Person in unserer Organisation:</p>

                <p>
                  <br /><br />
                  Henry Schuler <br />
                  Kastellstraße 69/1 <br />
                  88316 Isny <br />
                  <br />
                  Tel: +49 163 7292914 <br />
                  E-Mail: devchat.contact@gmail.com <br /><br />
                </p>

                <p><em>Die Datenschutzerklärung wurde mithilfe der activeMind AG erstellt, den Experten für <a href="https://www.activemind.de/datenschutz/datenschutzbeauftragter/">externe Datenschutzbeauftragte</a> (Version #2020-09-30).</em></p>
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
export default Impressum;