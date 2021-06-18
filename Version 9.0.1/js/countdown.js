//ZUERST Checkboxen deaktivieren wenn Checkbox 1: kein Signalton angekreuzt worden ist:
document.getElementById("check1").addEventListener("change",disableCheckboxen) //funktion Zeile:212

// Dann mithilfe des Change Event Listener getriggertes Warnzeichen entfernen, wenn ein Pflichtfeld befüllt worden ist
//*********************************************************************************************
document.getElementById("container1").addEventListener("change",function()
{
    if(!document.getElementById("modulnummer").value == "")
    {
        document.getElementById("modulnummer_error").style.display="none";
    }
    if (!document.getElementById("kennziffer").value == "")
    {
        document.getElementById("kennziffer_error").style.display="none";
    }
    if (!document.getElementById("vorname").value == "")
    {
        document.getElementById("vornamen_error").style.display="none";
    }
    if (!document.getElementById("nachname").value == "")
    {
        document.getElementById("nachnamen_error").style.display="none";
    }
})

document.getElementById("containerCounter").addEventListener("change",function()
{
    if (!document.getElementById("klausurZeit").value == "")
    {
        document.getElementById("klausurZeit_error").style.display="none";
    }

    if (document.getElementById("klausurZeit").value <=0)
    {
        document.getElementById("klausurZeit_error").style.display="inline-block";
    }
    else if(document.getElementById("klausurZeit").value >0)
    {
        document.getElementById("klausurZeit_error").style.display="none";
    }

})
//********************************************************************************************* */
//DANN Counter einleiten nach Button click
document.getElementById("counterStart").addEventListener("click", function()
{   

    //nach Klick wird geprüft ob die Felder "KENNZIFFER: MODUL UND ZEITANSATZ" ausgefüllt sind!
    //wenn dem nicht so ist, wird ein Warnzeichen daneben eingeblendet --> mit Change Eventlistener von oben, wird dies aufgehoben
    if (document.getElementById("modulnummer").value == "") 
    { 
        let message= document.getElementById("modulnummer_error").style.display="inline-block";
        return message
    }
//**************************************************************************************************** */
    if (document.getElementById("kennziffer").value == "") 
    { 
        let message= document.getElementById("kennziffer_error").style.display="inline-block";
        return message
    }
//**************************************************************************************************** */
    if (document.getElementById("vorname").value == "") 
    { 
        let message= document.getElementById("vornamen_error").style.display="inline-block";
        return message
    }
//**************************************************************************************************** */
    if (document.getElementById("nachname").value == "") 
    { 
        //let message = document.getElementById("nachnamen_error").innerHTML="Bitte geben Sie Ihren Nachnamen an!"
        let message= document.getElementById("nachnamen_error").style.display="inline-block";
        return message
    }
//**************************************************************************************************** */
    if (document.getElementById("klausurZeit").value == "") 
    { 
        let message= document.getElementById("klausurZeit_error").style.display="inline-block";
        return message
    }
 //**************************************************************************************************** */
   
    //überprüfen das Countdown nicht mit 0 oder negativer Zahl startet
    if (document.getElementById("klausurZeit").value <=0) 
    { 
        let message= document.getElementById("klausurZeit_error").style.display="inline-block";
        return message
    }
    
    
    //Nach Prüfung erscheint der Container mit dem Countdown
    let countdownContainer= document.getElementById("countdownContainer")
    countdownContainer.style.display="block";
    //und der Dateicontainer wird angezeigt, falls jemand vor dem Counter fertig ist
    let dateienContainer= document.getElementById("containerDateien")
    dateienContainer.style.display="block";
    //Modulnummer und Kennziffer verschwinden in den Hintergrund
    let kennzifferContainer= document.getElementById("container1")
    kennzifferContainer.style.display="none";
    //und die Funktion countdown() bzw countdownOhneAudio() wird ausgeführt

    let checkboxNoAudio= document.getElementById("check1").checked //boolean rückgabe || Prüfung ob Check1 angekreuzt wurde oder nicht
    if(checkboxNoAudio==true)
    {
        countdownOhneAudio()
    }
    else
    {
        countdown()
    }
   

} )

//stunde= 3600sek //min= 60sek //sek= restmin
function countdown()
{
   //Counter Angaben verschwinden nach Click
   document.getElementById("containerCounter").style.display="none";
   ///VIEL GLück Message unter Counter anzeigen
   let modul= document.getElementById("modulnummer").value
   document.getElementById("vielGlueck").innerHTML="Viel Glück im Modul: "+modul
   ///

    //StartAudio einleiten
    let startmp3= "../audios/start.mp3"
    let startAudio= new Audio(startmp3)
    startAudio.play()
    
    //Wert von Klausurzeit nehmen und in Sekunden umwandeln
    let gesamtZeit= parseFloat(document.getElementById("klausurZeit").value) //das sind jetzt z.B. "120"
    gesamtZeit=gesamtZeit*60 //7200sek= 120"min"*60sec 
    
    let counter= //die Variable wird später nochmal benötigt für clearInterval
    setInterval( function()
    {
        let stunde= Math.floor(gesamtZeit/3600) // hier kommt z.B. 1.9 raus also 1
        let restStunde= gesamtZeit-(stunde*3600) // 7199-(1*3600)= 3599sec

        let minuten= Math.floor(restStunde/60) //3599sec/60= 59.98 = 59 Minuten // bei 58min [3539sec=58,98]
        
        let restMinuten= restStunde-(minuten*60) //3599-(59*60)=59 Sekunden --- tickt bis 3540 dann // 3539-(58*60)=59sec
        let sekunden=restMinuten
        if(gesamtZeit <= 0)
        {   
            clearInterval(counter)                  //stoppt Counterfunktion (festgelegt in Variable)
            let endeMp3= "../audios/ende.mp3"
            let endAudio= new Audio(endeMp3)
            endAudio.play()
            //Angabe Felder zum Countdown verschwinden
            document.getElementById("countdownContainer").style.display="none";
            //Countdown Ende Container poppt auf. Mit Nachricht
            document.getElementById("countDownEndeContainer").style.display="block";
        }
        else
        {   
            document.getElementById("countdownErgebnis").innerHTML=
            "Countdown läuft noch:"+ "<br>" +stunde+"hr "+ minuten+"min "+ sekunden+"sec"
            //Funktion Alarm aufrufen mit Parameter (return von getCheckBoxValue| und Zeit in sek)
            alarm(getCheckBoxValue(),gesamtZeit)
            //Funktion colorChanger aufrufen mit Parameter ( Zeit in sek)
            colorChanger(gesamtZeit)
        }
        gesamtZeit= gesamtZeit-1
    }
    ,1000) //1000ms= 1sek
}

//***********************************************************************************************************/
//Diese Funktion prüft ob Signalton abgespielt werden soll
function alarm(werte, gesamtZeit) //werte ist ein Array mit zahlen
{ 
    //console.log("die werte: "+ werte) funktioniert sauber

    let inhalt  //variable deklarieren für Switch 

    for(inhalt of werte)    //for Schleife durchläuft übergebenes Array und speichert die werte in inhalt
    {
        inhalt=parseInt(inhalt)   //inhalt wird mit parseInt zu int umgewandelt (weil Werte müsste ein String sein)
        switch(inhalt)             //switch wird geprüft danach nächstes inhalt Item
        {
            case 5:
                {
                    if(gesamtZeit==300)
                    {
                        let mp3= "../audios/5min.mp3"
                        let audio= new Audio(mp3)
                        audio.play()
                    }  
                    break; 
                }       
                
            case 15:
                {
                    if(gesamtZeit==900) //getestet mit 295 || (15*60) 900
                    {
                        mp3= "../audios/15min.mp3"
                        audio= new Audio(mp3)
                        audio.play()
                    }
                    break;
                }

            case 30:
                {
                    if(gesamtZeit==1800) //getestet mit 290...          1800 (60*30min)
                    {
                        mp3= "../audios/30min.mp3"
                        audio= new Audio(mp3)
                        audio.play()
                    }
                    break;
                }

            case 60:
                {
                    if(gesamtZeit==3600) //getestet mit 285s           3600(60*60min)
                    {
                        mp3= "../audios/60min.mp3"
                        audio= new Audio(mp3)
                        audio.play()
                    }
                    break;
                }
            case 90:
                {
                    if(gesamtZeit==5400) // getestet mit 280s          5400(60*90min)
                    {
                        mp3= "../audios/90min.mp3"
                        audio= new Audio(mp3)
                        audio.play()
                    }
                    break;
                } 
            default:
                break;
        }
    }
}

//***********************************************************************************************************/
function getCheckBoxValue()
{
    
    let check2=document.getElementById("check2").checked
    let check3=document.getElementById("check3").checked
    let check4=document.getElementById("check4").checked
    let check5=document.getElementById("check5").checked
    let check6=document.getElementById("check6").checked
    let istGecheckt=[check2,check3,check4,check5,check6] //die Box ist jetzt gefüllt mit false,true,false, true etc.


    let wert2=document.getElementById("check2").value
    let wert3=document.getElementById("check3").value
    let wert4=document.getElementById("check4").value
    let wert5=document.getElementById("check5").value
    let wert6=document.getElementById("check6").value
    let alleWerte=[wert2,wert3,wert4,wert5,wert6] //hab jetzt alle Werte der Checkboxen

    let werte= new Array()

    for(let i=0; i<istGecheckt.length;i++)
    {
        if(istGecheckt[i]==true)
        { // wenn das Stimmt will ich den Wert aus dem alleWerte Array in mein werte[] pushen

            werte.push(alleWerte[i])
        }
    }
    return werte //[werte SAUBER in einem Array zurückgegeben] und nicht [,,15,60,]
}


//***********************************************************************************************************/
//alle Checkboxen nehmen
function disableCheckboxen() 
{
    let check2= document.getElementById("check2")
    let check3= document.getElementById("check3")
    let check4= document.getElementById("check4")
    let check5= document.getElementById("check5")
    let check6= document.getElementById("check6")

    if(this.checked) //this bezieht sich auf checkbox1 --> getElementById("check1").addEventListener(...)
    {
        check2.disabled=true;   //disabled= ausgrauen lassen
        check2.checked=false;   //falls der Wert angekreuzt worden ist, Kreuz entfernen
        //
        check3.disabled=true;
        check3.checked=false;
        //
        check4.disabled=true;
        check4.checked=false;
        //
        check5.disabled=true;
        check5.checked=false;
        //
        check6.disabled=true;
        check6.checked=false;
    }
    else
    {
        check2.disabled=false;
        check3.disabled=false;
        check4.disabled=false;
        check5.disabled=false;
        check6.disabled=false;
    }
}
//***********************************************************************************************************/
//macht genau dasselbe wie countdown nur ohne Audios
function countdownOhneAudio()
{
    //Counter Angaben verschwinden nach Click
   document.getElementById("containerCounter").style.display="none";
   ///VIEL GLück Message unter Counter anzeigen
   let modul= document.getElementById("modulnummer").value
   document.getElementById("vielGlueck").innerHTML="Viel Glück im Modul: "+modul
   ///


    let gesamtZeit= parseFloat(document.getElementById("klausurZeit").value) //das sind jetzt z.B. "120"
    gesamtZeit=gesamtZeit*60 //7200sek= 120"min"*60sec 

 //   var warnSignal= parseInt(document.getElementById("warnSignal").checked) das geht mit Select
    
    let counter= //die Variable wird benötigt für clearInterval
    setInterval( function()
    {
        let stunde= Math.floor(gesamtZeit/3600) // hier kommt z.B. 1.9 raus also 1
        let restStunde= gesamtZeit-(stunde*3600) // 7199-(1*3600)= 3599sec

        let minuten= Math.floor(restStunde/60) //3599sec/60= 59.98 = 59 Minuten // bei 58min [3539sec=58,98]
        
        let restMinuten= restStunde-(minuten*60) //3599-(59*60)=59 Sekunden --- tickt bis 3540 dann // 3539-(58*60)=59sec
        let sekunden=restMinuten
        

        if(gesamtZeit <= 0)
        {
            clearInterval(counter)
            
            //Countdown verschwindet nachdem abgelaufen
            document.getElementById("countdownContainer").style.display="none";
            //Countdown Ende Container mit Nachricht poppt auf
            document.getElementById("countDownEndeContainer").style.display="block";
        }
        else
        {   
            document.getElementById("countdownErgebnis").innerHTML=
            "Countdown läuft noch:"+ "<br>" +stunde+"hr "+ minuten+"min "+ sekunden+"sec"
            colorChanger(gesamtZeit)
        }
        gesamtZeit= gesamtZeit-1
    }
    ,1000) //1000ms= 1sek
}

//***********************************************************************************************************/
//Diese Funktion wechselt die Countdown Hintergrundfarben
//Übergabewert ist die gesamtZeit, welche bei XY Sekunden triggert
function colorChanger(Zeit)
{ 
    let hintergrundFarbe= document.getElementById("countdownErgebnis")
    let ausgangsZeit= parseFloat(document.getElementById("klausurZeit").value*60) //z.B. 7200sec also gelb=3.600sec rot=1800sec
    let gelbeWarnung=Math.floor(ausgangsZeit*0.5)       //Math.floor falls Kommazahlen rauskommen sollten, dann wird abgerundet
    let roteWarnung=Math.floor(ausgangsZeit*0.25)
    let alleWarnungen=[gelbeWarnung,roteWarnung]
    let index
    for(index of alleWarnungen)
    {
        switch(index)      
        {
            case (gelbeWarnung):
                {
                    if(Zeit==gelbeWarnung)
                    {
                        hintergrundFarbe.classList.remove("bg-success")
                        hintergrundFarbe.classList.add("bg-warning")
                    }
                    break;
                }

            case (roteWarnung):
                {
                    if(Zeit==roteWarnung)
                    {
                        hintergrundFarbe.classList.remove("bg-warning")
                        hintergrundFarbe.classList.add("bg-danger")
                    }
                    break;
                } 

            default:
                {
                    break;
                }
        }
    }
}