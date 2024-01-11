import mysqlUtil from './mysqlUtil';

export const updateFriendScore = async (userIdx: number, friendIdx: number) => {
  // 1. 팔로우 / 팔로잉 확인
  const isFollowing = await mysqlUtil.getOne('tb_follow', [], { follower_idx: userIdx, followed_idx: friendIdx });
  const isFollowed = await mysqlUtil.getOne('tb_follow', [], { follower_idx: friendIdx, followed_idx: userIdx });

  // 2. 같은 챌린지 진행중인 수 확인
  const callengeOfUser = (
    await mysqlUtil.getMany('tb_challenge_user_mapping', ['challenge_idx'], { user_idx: userIdx })
  ).map((challenge) => challenge.challenge_idx);
  const callengeOfFriend = (
    await mysqlUtil.getMany('tb_challenge_user_mapping', ['challenge_idx'], {
      user_idx: friendIdx,
    })
  ).map((challenge) => challenge.challenge_idx);
  const commonCallenge = callengeOfUser.filter((callenge) => callengeOfFriend.includes(callenge));
  console.log('[commonCallenge]', commonCallenge);

  // 3. 가중치에 따라 친밀도 점수 계산
  let score = 0;
  if (isFollowing) score += 5 * 1;
  if (isFollowed) score += 1 * 1;
  if (commonCallenge.length > 0) score += 1 * commonCallenge.length;
  console.log('[friendScore to be added]', score);

  // 4. 친밀도 테이블에 데이터 있는지 확인
  const friendScore = await mysqlUtil.getOne('tb_intimacy', [], { user_from: userIdx, user_to: friendIdx });
  console.log('[current friendScore]', friendScore?.score);

  // 5. 친밀도 업데이트 (없으면 생성)
  if (friendScore)
    await mysqlUtil.update(
      'tb_intimacy',
      { score: friendScore.score + score },
      { user_from: userIdx, user_to: friendIdx }
    );
  else await mysqlUtil.create('tb_intimacy', { user_from: userIdx, user_to: friendIdx, score });
};
