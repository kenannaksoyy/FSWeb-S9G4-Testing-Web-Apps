import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';



test('hata olmadan render ediliyor', () => {
    render(<IletisimFormu/>); //formu renderladık
});

test('iletişim formu headerı render ediliyor', () => {
    render(<IletisimFormu/>);
    const baslik = screen.getByTestId("form-title");//data-testid ile tittle kontrolledik
    expect(baslik).toBeInTheDocument();//expectten varmı kontrolledik
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu/>);
    const isim = screen.getByTestId("isim-input");//isim inputunu bulduk
    fireEvent.change(isim,{target:{value:"zzz"}});//isim input zzz verdik
    expect(isim.value).toBe("zzz");//isim input zzz kontrolu

    const isimError = screen.getByTestId("isim-error"); //erroru bulduk
    expect(isimError).toBeInTheDocument();//aktifmi kontrolledik

});

test('kullanıcı inputları doldurmadığında gonderirse ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>);
    const submitButton = screen.getByTestId("submit-button");//butonu bulduk
    fireEvent.click(submitButton);//butona tıkladık
    let dizi=["isim-error","soyad-error","mail-error"];
    dizi.forEach(err => {
        expect(screen.getByTestId(err)).toBeInTheDocument();//her error bakıyor
    });
    
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>);
    fireEvent.change(screen.getByTestId("isim-input"),{target:{value:"Kenan"}});
    fireEvent.change(screen.getByTestId("soyad-input"),{target:{value:"Aksoy"}});
    //fireEvent.change(screen.getByTestId("mail-input"),{target:{value:"asiBelaaxxxx"}});
    //fireEvent.change(screen.getByTestId("mail-input"),{target:{value:""}});
    fireEvent.click(screen.getByTestId("submit-button"));
    expect(screen.getByTestId("mail-error")).toBeInTheDocument();
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    render(<IletisimFormu/>);
    fireEvent.change(screen.getByTestId("mail-input"),{target:{value:"asiBelaaxxxx"}});
    expect(screen.getByText('Hata: email geçerli bir email adresi olmalıdır.')).toBeInTheDocument();//mesajı aradık
    
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render(<IletisimFormu/>);
    fireEvent.change(screen.getByTestId("isim-input"),{target:{value:"Kenan"}});
    fireEvent.change(screen.getByTestId("mail-input"),{target:{value:"kenannn@gmail.com"}});
    fireEvent.click(screen.getByTestId("submit-button"));
    expect(screen.getByText('Hata: soyad gereklidir.')).toBeInTheDocument();

});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    render(<IletisimFormu/>);
    fireEvent.change(screen.getByTestId("isim-input"),{target:{value:"Kenan"}});
    fireEvent.change(screen.getByTestId("soyad-input"),{target:{value:"Aksoy"}});
    fireEvent.change(screen.getByTestId("mail-input"),{target:{value:"kenannn@gmail.com"}});
    fireEvent.click(screen.getByTestId("submit-button"));
    expect(screen.getByTestId("mesaj-error")).not.toBeInTheDocument();
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu/>);
    const form = {
        ad: "Kenan",
        soyad: "Aksoy",
        email: "kenanaksoyy@gmail.com",
        mesaj: "olmayanı bulamadım Yapamadım"
      };
      fireEvent.change(screen.getByTestId("isim-input"),{target:{value:form["ad"]}});
      fireEvent.change(screen.getByTestId("soyad-input"),{target:{value:form["soyad"]}});
      fireEvent.change(screen.getByTestId("mail-input"),{target:{value:form["email"]}});
      fireEvent.change(screen.getByTestId("mesaj-input"),{target:{value:form["mesaj"]}});
      fireEvent.click(screen.getByTestId("submit-button"));

      expect(screen.getByText(`Ad:${form["ad"]}`)).toBeInTheDocument();
      expect(screen.getByText(`Soyad:${form["soyad"]}`)).toBeInTheDocument();
      expect(screen.getByText(`Email:${form["email"]}`)).toBeInTheDocument();
      expect(screen.getByText(`Mesaj:${form["mesaj"]}`)).toBeInTheDocument();
});
