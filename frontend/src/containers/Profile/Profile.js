import React, { useEffect, useCallback } from 'react'
import { useQuery } from 'react-query'
import api from '../../api'
import classes from './Profile.module.css'
import ProfileSummary from '../../components/ProfileSummary/ProfileSummary'
import Type from '../../components/Type/Type'
import Navbar from '../../components/Navbar/Navbar'
import Logo from '../../components/Logo/Logo'
import Error from '../../components/Error/Error'
import Loader from '../../components/Loader/Loader'

const Profile = () => {
  const updateIncomeExpenses = updatedItems => {
    const income = []
    const expenses = []
    for (const item of updatedItems) {
      if (item.isIncome) {
        income.push(item)
      } else {
        expenses.push(item)
      }
    }
    return { income, expenses }
  }

  const onFetchProfile = useCallback(async () => {
    const res = await api.get('user')
    return res.data
  }, [])

  const onAddIncomeType = useCallback(async type => {
    const isIncome = true
    const res = await api.patch('user/category', {
      category: type,
      isIncome
    })
    return res.data
  }, [])

  const onAddExpenseType = useCallback(async type => {
    const isIncome = false
    const res = await api.patch('user/category', {
      category: type,
      isIncome
    })
    return res.data
  }, [])

  const onDeleteIncomeType = useCallback(async id => {
    const res = await api.delete(`user/category/${id}`)
    return res.data
  }, [])

  const onDeleteExpenseType = useCallback(async id => {
    const res = await api.delete(`user/category/${id}`)
    return res.data
  }, [])

  useEffect(onFetchProfile, [onFetchProfile])

  const { data, isLoading, isError } = useQuery('profile', onFetchProfile)

  let profileSummary
  let incomeType
  let expensesType

  if (isLoading) {
    profileSummary = <Loader />
    incomeType = <Loader />
    expensesType = <Loader />
  } else if (isError) {
    profileSummary = <Error />
    incomeType = <Error />
    expensesType = <Error />
  } else {
    const { income, expenses } = updateIncomeExpenses(data.categories)
    profileSummary = (
      <ProfileSummary
        firstName={data.firstName}
        lastName={data.lastName}
        email={data.email} />
    )
    incomeType = (
      <Type
        content={income}
        color='primary'
        addType={onAddIncomeType}
        deleteType={onDeleteIncomeType} />
    )
    expensesType = (
      <Type
        content={expenses}
        color='danger'
        addType={onAddExpenseType}
        deleteType={onDeleteExpenseType} />
    )
  }

  return (
    <div className={classes.Profile}>
      <div className={classes.Main}>
        <div className={classes.Column}>
          {profileSummary}
          <Logo />
        </div>
        {incomeType}
        {expensesType}
      </div>
      <Navbar active='p' />
    </div>
  )
}

export default Profile
