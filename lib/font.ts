import { Sriracha, Open_Sans, Hind_Siliguri } from 'next/font/google';


export const sriracha = Sriracha({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
})

export const open_sans = Open_Sans(
    {
        subsets : ['latin'],
        weight : '400',
    }
)

export const hindSiliguri = Hind_Siliguri({
    weight: ['400', '600', '700'],
    subsets: ['bengali'],
    display: 'swap',
})