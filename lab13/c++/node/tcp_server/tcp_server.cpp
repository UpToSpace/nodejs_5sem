#define _WINSOCK_DEPRECATED_NO_WARNINGS
#include "Winsock2.h"
#include <iostream>
#include <clocale>
#include <ctime>

#include "ErrorMsgText.h"
#pragma comment(lib, "WS2_32.lib") 

using namespace std;

int main()
{
    setlocale(LC_ALL, "rus");
    WSADATA wsaData;
    SOCKET  sS;
    SOCKADDR_IN serv;
    serv.sin_family = AF_INET;
    serv.sin_port = htons(40000);
    serv.sin_addr.s_addr = INADDR_ANY;

    try {
        if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0) {
            throw  SetErrorMsgText("Startup: ", WSAGetLastError());
        }
        if ((sS = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET) {
            throw  SetErrorMsgText("socket: ", WSAGetLastError());
        }
        if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR) {
            throw  SetErrorMsgText("bind: ", WSAGetLastError());
        }
        if (listen(sS, SOMAXCONN) == SOCKET_ERROR) {
            throw SetErrorMsgText("listen: ", WSAGetLastError());
        }
        SOCKET cS;
        SOCKADDR_IN clnt;
        memset(&clnt, 0, sizeof(clnt));
        int lclnt = sizeof(clnt);
        while (true) {
            if ((cS = accept(sS, (sockaddr*)&clnt, &lclnt)) == INVALID_SOCKET)
                throw SetErrorMsgText("accept: ", WSAGetLastError());
            while (true) {
                char message[50] = "";
                if ((recv(cS, message, sizeof(message), NULL)) == SOCKET_ERROR)
                    throw SetErrorMsgText("recv: ", WSAGetLastError());
                cout << message;
                string obuf = "ECHO: " + (string)message;
                if (strcmp(message, "") == 0) {
                    break;
                }
                if ((send(cS, obuf.c_str(), strlen(obuf.c_str()) + 1, NULL)) == SOCKET_ERROR)
                    throw SetErrorMsgText("send: ", WSAGetLastError());

            }
        }
        if (closesocket(sS) == SOCKET_ERROR) {
            throw  SetErrorMsgText("closesocket: ", WSAGetLastError());
        }
        if (WSACleanup() == SOCKET_ERROR) {
            throw  SetErrorMsgText("Cleanup: ", WSAGetLastError());
        }
    }
    catch (string errorMsgText) {
        WSACleanup();
        cout << '\n' << errorMsgText;
    }
    system("pause");
    return 0;
}