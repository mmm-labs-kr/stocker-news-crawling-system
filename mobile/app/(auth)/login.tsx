import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/common/Button';
import { FormInput } from '../../src/components/common/FormInput';
import { colors } from '../../src/theme';

type Mode = 'login' | 'signup';

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.tabs}>
          {(['login', 'signup'] as const).map((m) => {
            const isActive = mode === m;
            return (
              <Pressable key={m} onPress={() => setMode(m)} style={styles.tabBtn}>
                <Text style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive]}>
                  {m === 'login' ? '로그인' : '회원가입'}
                </Text>
                <View style={[styles.tabBar, isActive && styles.tabBarActive]} />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.form}>
          <FormInput
            label="이메일"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <FormInput
            label="비밀번호"
            placeholder="8자 이상"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {mode === 'signup' && (
            <FormInput
              label="닉네임"
              placeholder="앱에서 사용할 이름"
              value={nickname}
              onChangeText={setNickname}
            />
          )}

          {mode === 'login' && (
            <Pressable style={styles.forgotWrap}>
              <Text style={styles.forgotText}>비밀번호 찾기</Text>
            </Pressable>
          )}

          <Button variant="primary" style={styles.submitBtn}>
            {mode === 'login' ? '로그인' : '계정 만들기'}
          </Button>
        </View>

        <Pressable style={styles.skipWrap} onPress={() => router.replace('/')}>
          <Text style={styles.skipText}>로그인 없이 둘러보기 →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 18,
  },
  tabBtn: {
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    letterSpacing: -0.15,
    paddingBottom: 4,
  },
  tabTextActive: {
    color: colors.text.primary,
  },
  tabTextInactive: {
    color: colors.text.tertiary,
  },
  tabBar: {
    height: 2,
    backgroundColor: 'transparent',
  },
  tabBarActive: {
    backgroundColor: colors.accent.solid,
  },
  form: {
    gap: 12,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  forgotText: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  submitBtn: {
    height: 52,
    marginTop: 14,
  },
  skipWrap: {
    alignItems: 'center',
    paddingTop: 24,
  },
  skipText: {
    color: colors.text.tertiary,
    fontSize: 13,
  },
});
