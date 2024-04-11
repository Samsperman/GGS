from math import sin, cos
from math import tan as tg, log as ln, log10 as lg
from math import pi
import numbers

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

def calculate(stroka):
    trigon = ['sin', 'cos', 'tg', 'ctg', 'ln', 'lg']
    i=-1
    b = []
    while 'sqrt' in stroka:
        i+=1
        if stroka[i]=='sqrt':
            b = [str(float(stroka[i+1]) ** 0.5)]
            stroka = stroka[0:i] + b + stroka[i + 1:]
            i-=1
    i = 0
    while '^' in stroka:
        i+=1
        if (stroka[i]=='^') and stroka[i-1] not in trigon:
            b = [str(float(stroka[i - 1]) ** float(stroka[i + 1]))]
            stroka = stroka[0:i - 1] + b + stroka[i + 2:]
            i-=1
        elif stroka[i]=='^' :
            if stroka[i-1] == 'sin':
                b = [str((sin(float(stroka[i + 2])))**float(stroka[i+1]))]
                stroka = stroka[0:i-1] + b + stroka[i + 3:]
                i-=1
            if stroka[i-1] == 'cos':
                b = [str((cos(float(stroka[i + 2])))**float(stroka[i+1]))]
                stroka = stroka[0:i-1] + b + stroka[i + 3:]
                i-=1
            if stroka[i-1] == 'tg':
                b = [str((tg(float(stroka[i + 2])))**float(stroka[i+1]))]
                stroka = stroka[0:i-1] + b + stroka[i + 3:]
                i-=1
            if stroka[i-1] == 'ctg':
                b = [str((sin(float(stroka[i + 2])))**float(stroka[i+1])*(-1))]
                stroka = stroka[0:i-1] + b + stroka[i + 3:]
                i-=1



    i = -1
    while 'sin' in stroka or 'cos' in stroka or 'tg' in stroka or 'ctg' in stroka or 'ln' in stroka or 'lg' in stroka:
        i += 1
        if stroka[i] == 'ln':
            b = [str((round(ln(float(stroka[i + 1])),5)))]
            stroka = stroka[0:i] + b + stroka[i + 2:]
            i-=1
        if stroka[i] == 'lg':
            b = [str((round(lg(float(stroka[i + 1])),5)))]
            stroka = stroka[0:i] + b + stroka[i + 2:]
            i-=1
        if stroka[i] == 'sin':
            b = [str((round(sin(float(stroka[i + 1])),5)))]
            stroka = stroka[0:i] + b + stroka[i + 2:]
            i-=1
        if stroka[i] == 'cos':
            b = [str((round(cos(float(stroka[i + 1])),5)))]
            stroka = stroka[0:i] + b + stroka[i + 2:]
            i-=1
        if stroka[i] == 'tg':
            b = [str((round(tg(float(stroka[i + 1])),5)))]
            stroka = stroka[0:i] + b + stroka[i + 2:]
            i-=1
        if stroka[i] == 'ctg':
            b = [str((round((tg(float(stroka[i + 1])))**(-1),5)))]
            stroka = stroka[0:i] + b + stroka[i + 2:]
            i-=1


    i = 0
    while '*' in stroka or '/' in stroka:
        i += 1
        if stroka[i] == '*':
            b = [str(float(stroka[i - 1]) * float(stroka[i + 1]))]
            stroka = stroka[0:i - 1] + b + stroka[i + 2:]
            i-=1
        elif (stroka[i]) == '/':
            if float(stroka[i+1])!=0:
                b = [str(float(stroka[i - 1]) / float(stroka[i + 1]))]
                stroka = stroka[0:i - 1] + b + stroka[i + 2:]
                i-=1
            else:
                print('Деление на ноль')
                exit()



    i = 0
    while '+' in stroka or '-' in stroka:
        i += 1
        if stroka[i] == '+':
            b = [str(float(stroka[i - 1]) + float(stroka[i + 1]))]
            stroka = stroka[0:i - 1] + b + stroka[i + 2:]
            i-=1
        elif stroka[i] == '-':
            b = [str(float(stroka[i - 1]) - float(stroka[i + 1]))]
            stroka = stroka[0:i - 1] + b + stroka[i + 2:]
            i-=1
    return stroka


def scobbki(stroka):
    nach = 0

    kon = 0

    kolvo_scobok = 0
    for i in range(len(stroka)):
        if stroka[i] == '(':
            nach = i
            kolvo_scobok += 1
        if stroka[i] == ')':
            kon = i
            break
    if kolvo_scobok > 0:
        return scobbki(stroka[0:nach] + calculate(stroka[nach + 1:kon]) + stroka[kon + 1:])
    return stroka

def calculator():
    trigon = ['sin', 'cos', 'tg', 'ctg','ln','lg']
    s = input()
    d = []
    var = ''
    for i in range(len(s)):
        if s[i] != ' ':
            if s[i] in '+-*/^()':
                if var!='':
                    d.append(var)
                d.append(s[i])
                var=''
            else:
                var+=s[i]
    if var!='':
        d.append(var)
    if len(d)==0:
        print('Вы ничего не ввели')
        exit()
    i=-1
    dlina=len(d)
    while i<dlina-1:
        i+=1
        if not(is_number(d[i])) and d[i] not in trigon and d[i] not in '+-*/^()' and d[i]!='sqrt' and d[i]!='pi':
            print('Введено неизвестное значение')
            exit()
        if d[i] in '+-*/^':
            if len(d)<3:
                print('Операция без операторов')
                exit()
            else:
                if d[i-1] in '+-*/^' or d[i+1] in '+-*/^':
                    print('Две подряд операции')
                    exit()
        if d[i]=='-' and i>0 and d[i-1]=='(':
            d[i+1]='-'+d[i+1]
            d=d[0:i]+d[i+1:i+2]+d[i+2:]
            dlina=len(d)
            i-=1
        if d[i]=='pi':
            d[i]=str(pi)
    print(' '.join(d),' = ',(calculate(scobbki(d))[0]))

print('Доступные команды: sin(),cos(),tg(),ctg(),ln(),lg(),^,()','pi')
print()
print('Обратите внимание, что все скобочки надо закрывать и что 2(1+2) неверное написание,надо 2*(1+2)','\n','перед отрицательными числами ставьте скобки, например:(-1)+1')
print()
print('Для завершение работы калькулятора нажмите Enter в пустой строке')
print()
while True:
    calculator()