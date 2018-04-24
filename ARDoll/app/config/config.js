/**
 * Created by Koan on 2017/9/20.
 */
module.exports = {
	log                     : {
		type : 'rotating-file',
		path : '/var/log/dolls/server.log',
		count: 30,
		level: 'warn'
	},
	retentionCalcArray      : [1, 2, 3, 4, 5, 6, 7, 15, 30],
	push                    : {
		packageId: 'com.TianShe.DollMachine',
		ios      : {
			kid   : 'RP7ZF433Q8',
			teamId: '47KBHP6JE8'
		}
	},
	passport                : {
		// 微信客户端中的登录方式
		wechatMobile: {
			clientID    : 'wxeaa9f9edc0fe1971',
			clientSecret: 'fbb1dd1fbcf6d512fea66700b973cc1f'
		}
	},
	pay                     : {
		alipay: {
			appId           : '2017112300109667',
			appPrivKeyFile  : 'MIIEowIBAAKCAQEAtzdR+L1iSogWr2ZC62PecmdY8Ycby2Ti7Z9+AfhyxW54uaZyFhjC435ap2gK0lKYYIREhxK1glyFEFlSMku+Sc4IfVr8gRdF93Xe3nOMMKiIc9WMMHNE8p/VUb/TB6eyDRAE9T1fkgA8Q+lvWPLkhxEFQHpvj450ugSM4Yy2N1L9PKiOLHD7QKxFIsBvR5z2NTp4g+jqbBXtGioSTdsUKJTgFbN+pLj7FVkV+3+xJmM5cjGLhwLgdtcngVK2grt6n0/19cJJ8q5gbC53gEt8x88dAQ8J/7Xvdg1Y6rqvw3S2BuiflDQ2VMoXdaxr8J//IpG0eIQsmoFHxJ7+nM1DiQIDAQABAoIBAD2oQU7LNRPN/oxihqy+vDKV8wm9JS5qsi+zl+1D1iP5DGm1yPkEtjlm4U0rJ1EmeJ8qhAFM24aWajVZSd8hPFWMH7FH+GfdFC+2HB2SlyAc52bL+9SmRhK8lUZgnr0Zw0LAHFsHn2z75UwZd95gR2Xo5XKQgZC3KTMcquiQuRWepwbyYRIkchssyfVxOgZnwzgCulZHG3n7HB4SCR0en7HCIz39y8GbyhX/DFRBQbrU5kZldqrCGRcX6RlN8RUXxWCV88VR5Wlfch0VTVZamK1YFUtWUHEgEhiW2QrCdbXgcOJONVrHm6pww/2a3Tv9A0HBsfsfYrD5Nt8AAl0V2gECgYEA5vEFnCOgz0hKRdc3VO164Mbu4RYv1XXWu6pFiuDgdFGqpyP9OqdQwUtkpGK5Jis3WCJCHGu5ibKH9G61PZHXohJC2p/096j1BXFjgNntxTlua0H4R68ApksXn6fA8nTGGCLYSaSZyF6759X04K0afFFVMyBPMc117IG0fqCoTMkCgYEAyxibHDuQ66KYGPfDYMQ6C67s8+p2QuEpPhNMkzqDaFEwS8UR1r+acVInZW3Dd5WQpGqrh8INS7/OQ0wbGB+rWPV6iWSSCMORaKuRX+LUWvcON3s8peI/J8EUC90yTufun1hAlGseEDJK4y9q5w5tOcBz4w6rj/9i8oOj1IggYMECgYEAymqCwkIwFr6D6wchxlyIETAL/FmX/37TgZVSctF7qjhSXUEcGSbBj0pnofWt1piWX7dXPtXkv54tr77BOH/2AmYDFuCQs+nxKJ4j2rIox275KyWdWic3aIn04MkGQvy7DDiuXo3ZBFiUVjWf9rWCu2gGR1OQVlSBgZSGAV8LZJECgYAHqR3wqq6EtNVX28Ca3cvytN5rNOTREP0lQkUZKJPcU3Om6AAMQZ3puFeUE9fTouiZyww9SqyFtu5oy24aMtebu2ar2AdKHVZWxGHvY/bul3MJ1LQs7aPENBw1dlp3b3gouoN1FbVElyEMALXfkUO9ceztG5iNDe0FiMGdOqU+AQKBgH8KtK65lUceNWvckUx5L89UCz3ipO42rkFW9p4STH4KLXwQtlJAxbac8ihrgmAacdVmMJyNF0GTFxHkZF6NwzRPavlodzAXsKVBcnNmEagSWpe2eIIIscOZTzqyRm2yeVILVRsFEWG/8Gb014k2hZD5/OOZLuILjEjJ07mdvPsw',
			appPubKeyFile   : 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtzdR+L1iSogWr2ZC62PecmdY8Ycby2Ti7Z9+AfhyxW54uaZyFhjC435ap2gK0lKYYIREhxK1glyFEFlSMku+Sc4IfVr8gRdF93Xe3nOMMKiIc9WMMHNE8p/VUb/TB6eyDRAE9T1fkgA8Q+lvWPLkhxEFQHpvj450ugSM4Yy2N1L9PKiOLHD7QKxFIsBvR5z2NTp4g+jqbBXtGioSTdsUKJTgFbN+pLj7FVkV+3+xJmM5cjGLhwLgdtcngVK2grt6n0/19cJJ8q5gbC53gEt8x88dAQ8J/7Xvdg1Y6rqvw3S2BuiflDQ2VMoXdaxr8J//IpG0eIQsmoFHxJ7+nM1DiQIDAQAB0',
			alipayPubKeyFile: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv/LrS5F6l+mVSBVYEiv6AokF9RbFIH4FowjiMbYwh3a6tpi1JlaPi5iYMIUqaA1gUPhMxxkB226s0hvZyqaoHkf22+vK7Q0wCpPlfP+MWzov7OIaj9BlIs1WFQ0S+eEdpfRGrvYQBT1yH+0vYhj6LXPTk+KdUIe+AW6Zv6zT0Ypeh+WYHn7SRG/DFJuO9rs1OCoqhz/RyAsDt8c2TZxGDPVO3dzfoe6LPqthG4n9Wuu43QKh8KrQlyHQLDox1KjGdPl8fUFM8LRARbYSZNomFpWrcgEbkMJG9O+Pt8Nhh0SRjwem5oh8XHK7BHCG5OyJghMF9Gq6agvy7XvMk8UOYwIDAQAB',
			callbackUrl     : 'http://39.104.66.47:8888/api/app/pay/alipay/callback'
		},
		wechat: {
			appId      : 'wxeaa9f9edc0fe1971',
			mchId      : '1492720362',
			apiKey     : 'oj8QDNijDhpUxEyQfV8K87JACPe2a5j3',
			appSecret  : 'fbb1dd1fbcf6d512fea66700b973cc1f',
			callbackUrl: 'http://39.104.66.47:8888/api/app/pay/wechat/callback'
		},
		ios   : {
			bundleId: 'com.TianShe.DollMachine'
		}
	},
	cashCoinRatio           : 10,
	pointCoinRatio          : 0.2,
	dailyFreePlayCount      : 5,
	censorshipFlg           : true,
	censorshipVersion       : '1.4.2',
	censorshipVersionAndroid: '1.3.9',
	vs                      : [
		true,
		true
	]
};
