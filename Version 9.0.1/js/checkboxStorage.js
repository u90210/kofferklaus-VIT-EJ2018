window.addEventListener("DOMContentLoaded", schnappCheckboxen)
window.addEventListener("change", speicherCheckboxen)


function speicherCheckboxen()
{
  let checkbox1= document.getElementById("check1").checked //damit hole ich mir den checked Wert true oder false
  let checkbox2= document.getElementById("check2").checked
  let checkbox3= document.getElementById("check3").checked
  let checkbox4= document.getElementById("check4").checked
  let checkbox5= document.getElementById("check5").checked
  let checkbox6= document.getElementById("check6").checked
  let checkbox7= document.getElementById("check7").checked
  let checkbox8= document.getElementById("check8").checked
  let checkbox9= document.getElementById("check9").checked
 

  window.localStorage.setItem("Checkbox1", checkbox1)   //den oben genommenen Wert speichert ich im LocalStorage
  window.localStorage.setItem("Checkbox2", checkbox2)
  window.localStorage.setItem("Checkbox3", checkbox3)
  window.localStorage.setItem("Checkbox4", checkbox4)
  window.localStorage.setItem("Checkbox5", checkbox5)
  window.localStorage.setItem("Checkbox6", checkbox6)
  window.localStorage.setItem("Checkbox7", checkbox7)
  window.localStorage.setItem("Checkbox8", checkbox8)
  window.localStorage.setItem("Checkbox9", checkbox9)

}

function schnappCheckboxen()
{
  //console.log("checkParse "+check1) gibt True aus
  //console.log("checkStringify "+ JSON.stringify(window.localStorage.getItem("Checkbox1"))) gibt "True" aus
  //deswegen JASON.parse!

  let check1= JSON.parse(window.localStorage.getItem("Checkbox1"))  //variable check1 bekommt den Wert von Checkbox1 z.B. true oder false
  document.getElementById("check1").checked=check1                  // der Wert wird der checkbox mitgegeben

  let check2= JSON.parse(window.localStorage.getItem("Checkbox2"))
  document.getElementById("check2").checked=check2

  let check3= JSON.parse(window.localStorage.getItem("Checkbox3"))
  document.getElementById("check3").checked=check3

  let check4= JSON.parse(window.localStorage.getItem("Checkbox4"))
  document.getElementById("check4").checked=check4

  let check5= JSON.parse(window.localStorage.getItem("Checkbox5"))
  document.getElementById("check5").checked=check5

  let check6= JSON.parse(window.localStorage.getItem("Checkbox6"))
  document.getElementById("check6").checked=check6

  let check7= JSON.parse(window.localStorage.getItem("Checkbox7"))
  document.getElementById("check7").checked=check7

  let check8= JSON.parse(window.localStorage.getItem("Checkbox8"))
  document.getElementById("check8").checked=check8

  let check9= JSON.parse(window.localStorage.getItem("Checkbox9"))
  document.getElementById("check9").checked=check9

}