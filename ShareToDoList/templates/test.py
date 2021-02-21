

db = [{'id':'test@naver.com', 'pwd':'1234'}, {'id':'test2@naver.com', 'pwd':'5678'}]
id = 'test@naver.com'
pwd = '1234'
def check():
    for i in range(10):
        if id != 'test@naver.com':
            pass
        else:
            print('다른 아이디를 사용해주세요', id,i)
            return
    print('a')

check()